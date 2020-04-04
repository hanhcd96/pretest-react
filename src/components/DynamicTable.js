import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import PropTypes from 'prop-types'
import Pagination from './Pagination'
import Loading from '../components/Loading'

export const Texts = ({ value }) => <span>{(value && value.join(', ')) || '-'}</span>
export const TextValue = ({ value }) => <span>{value || '-'}</span>
export const PriceValue = ({ value }) => <span>{(!isNaN(value) && value.toLocaleString('en-US')) || '-'}</span>

export const HeadSort = ({ query, column, onFetchData }) => {
  const { _sort, _order } = query || {}
  const isSorting = _sort === column.key
  const isASC = _order === 'asc'
  const nextOrder = _order ? (isASC ? 'desc' : 'asc') : 'asc'
  return (
    <div
      className="d-flex align-items-center justify-content-between clickable"
      onClick={() => column.key && onFetchData({ ...query, _sort: column.key, _order: nextOrder })}
    >
      <span>{column.head}</span>
      {column.key && <i className={isSorting ? (isASC ? 'fa fa-sort-up' : 'fa fa-sort-down') : 'fa fa-sort'} />}
    </div>
  )
}

class DynamicTable extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    totalPages: PropTypes.number,
    data: PropTypes.array,
    loading: PropTypes.bool,
    onFetchData: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func
  }
  handleSelectPage = _page => {
    const query = this.props.query || {}
    this.props.onFetchData({ ...query, _page })
  }
  render() {
    const { columns = [], data = [], query, onFetchData, onDelete, onEdit, totalPages, loading } = this.props
    const currentPage = (query && query._page) || 1
    const tableProps = { columns, query, totalPages, loading, onFetchData, onDelete, onEdit }
    return (
      <>
        <div className="position-relative">
          {loading && <Loading absolute />}
          <Table striped bordered hover>
            <thead>
              <tr>
                {columns.map((column, i) => (
                  <th key={i}>
                    <HeadSort query={query} column={column} onFetchData={onFetchData} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIdx) => {
                const cols = columns.map((column, colIdx) => {
                  const ColComponent = column.component || TextValue
                  const key = column.key
                  return (
                    <td key={`col-${colIdx}`}>
                      <ColComponent value={row[key]} row={row} {...tableProps} />
                    </td>
                  )
                })
                return <tr key={rowIdx}>{cols}</tr>
              })}
            </tbody>
          </Table>
        </div>
        {totalPages > 1 && (
          <Pagination
            onSelect={this.handleSelectPage}
            maxButtons={5}
            boundaryLinks
            ellipsis
            first
            last
            activePage={Number(currentPage)}
            items={Number(totalPages)}
          />
        )}
      </>
    )
  }
}

export default DynamicTable
