import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
import qs from 'querystring' // native qs
import { findTruck, upsertTruck, deleteTruck } from '../../../actions'
import DynamicTable, { TextValue, Texts, PriceValue } from '../../../components/DynamicTable'
import FilterBox from '../../../components/FilterBox'
import GenericModal from '../../../components/GenericModal'
import UpsertTruckModal from './UpsertTruckModal'

import './Styles.scss'

const DimensionValue = ({ row }) => (
  <>
    <TextValue value={row.length} />-<TextValue value={row.width} />-<TextValue value={row.height} />
  </>
)
const TruckType = ({ value }) => (
  <>
    <TextValue value={value} /> ton
  </>
)

class ActionsColumn extends Component {
  deleteConfirmModal = React.createRef()
  editModal = React.createRef()

  onClickDelete = () => {
    this.deleteConfirmModal.current.show()
  }
  onClickEdit = () => {
    this.editModal.current.show()
  }
  _onConfirmDelete = () => this.props.onDelete(this.props.row.id)

  render() {
    const { row } = this.props
    return (
      <>
        <GenericModal ref={this.deleteConfirmModal} title="Delete truck" onConfirm={this._onConfirmDelete}>
          {row && `Are you sure to delete truck ${row.truckPlate} of ${row.driver}`}
        </GenericModal>
        <UpsertTruckModal onSubmit={this.props.onEdit} title="Edit truck" truck={row} ref={this.editModal} />
        <div className="d-flex">
          <i className="fa fa-trash-alt clickable mr-4 text-danger" onClick={this.onClickDelete} />
          <i className="fa fa-edit clickable" onClick={this.onClickEdit} />
        </div>
      </>
    )
  }
}

const tableColumns = [
  { key: 'id', head: 'Id' },
  { key: 'driver', head: 'Driver' },
  { key: 'truckPlate', head: 'Truck Plate' },
  { key: 'cargorType', head: 'Cargor Type', component: Texts },
  { key: 'truckYear', head: 'Product Year' },
  { key: 'truckType', head: 'Truck Type', component: TruckType },
  { key: 'price', head: 'price', component: PriceValue },
  { key: 'length', head: 'Dimension (L-W-H)', component: DimensionValue },
  { key: 'packingAddr', head: 'Parking address' },
  { key: 'status', head: 'Status' },
  { key: 'description', head: 'Desciption' },
  { head: 'Actions', component: ActionsColumn }
]
class TruckSearch extends Component {
  constructor(props) {
    super()
    const { location } = props
    let search = location.search || ''
    search = search.charAt(0) === '?' ? search.substr(1) : search
    const query = qs.parse(search) || {}
    this.state = { searching: false, hits: { query } }
  }
  addModal = React.createRef()
  componentDidMount() {
    this.handleFindTruck(this.state.hits.query, null, 1, 10)
  }
  componentDidUpdate(prevProps, prevState) {
    const { location } = this.props
    if (location.search === '' && prevProps.location.search) {
      this.handleFindTruck({}, null, 1, 10)
    }
  }

  handleFindTruck = query => {
    const { history } = this.props
    this.setState({ searching: true })
    return findTruck(query)
      .then(data => {
        this.setState({ searching: false, hits: { query, ...data } })
        history.replace(`/?${qs.stringify(query)}`)
      })
      .catch(error => {
        toast.error('Some thing when wrong when fetching trucks!')
        this.setState({ searching: false, error })
      })
  }
  handleDeleteTruck = id =>
    deleteTruck(id)
      .then(() => {
        const { hits } = this.state
        const data = (hits.data || []).filter(o => o.id !== id)
        this.setState({ hits: { ...hits, data } })
        toast.success('Deleted!')
        return id
      })
      .catch(() => toast.error('Some thing when wrong when delete truck!'))
  handleUpsertTruck = values => {
    return upsertTruck(values)
      .then(truck => {
        const { hits } = this.state
        let data = hits.data || []
        if (!values.id) {
          data.unshift(truck)
        } else {
          data = data.map(o => (o.id === truck.id ? truck : o))
        }
        this.setState({ hits: { ...hits, data } })
        toast.success('Success!')
        return truck
      })
      .catch(err => {
        toast.error('Some thing when wrong when Upsert truck!')
      })
  }
  handleOpenAddModal = () => this.addModal.current.show()

  render() {
    const {
      searching,
      hits: { query, totalPages, data }
    } = this.state
    return (
      <>
        <Row>
          <Col md={6}>
            <FilterBox name="truck" onFilter={this.handleFindTruck} initialValues={{ q: query && query.q }} />
          </Col>
          <Col md={6}>
            <UpsertTruckModal onSubmit={this.handleUpsertTruck} title="Add truck" truck={{}} ref={this.addModal} />
            <Button onClick={this.handleOpenAddModal}>Add Truck</Button>
          </Col>
        </Row>
        <DynamicTable
          loading={searching}
          columns={tableColumns}
          data={data}
          totalPages={totalPages}
          query={query}
          onFetchData={this.handleFindTruck}
          onDelete={this.handleDeleteTruck}
          onEdit={this.handleUpsertTruck}
        />
      </>
    )
  }
}

export default TruckSearch
