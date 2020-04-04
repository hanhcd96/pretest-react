import React, { Component } from 'react'
import Col from 'react-bootstrap/Col'
import BsForm from 'react-bootstrap/Form'
import Form, { Field } from '../../../components/Form'
import InputField from '../../../components/InputField'
import TextareField from '../../../components/TextareField'
import { combine, required, maxLength, number, licensePlate } from '../../../validations'
import { findTruck } from '../../../actions'
import MultiplelValuesField from '../../../components/MultiplelValuesField'
import SelectField from '../../../components/SelectField'
import GenericModal from '../../../components/GenericModal'

class UpsertTruckForm extends Component {
  handleAutoDriver = value => {
    return findTruck({ driver: { _like: value } }).then(({ data }) => data.map(o => o.driver))
  }
  handleAutoCargorType = value => {
    return findTruck({ cargorType: { _like: value } }).then(({ data }) => {
      let cargorTypes = data.map(o => o.cargorType) || []
      return cargorTypes.reduce((results, arr) => {
        const inclArr = arr.filter(o => o.includes(value))
        results = results.concat(inclArr)
        return results
      }, [])
    })
  }
  render() {
    const { truck, onSubmit, formRef } = this.props
    return (
      <Form name={`truck-upsear-${truck.id}`} onSubmit={onSubmit} initialValues={truck} ref={formRef}>
        <Field
          component={InputField}
          name="truckPlate"
          placeholder="Truck Plate"
          validate={combine(required, licensePlate)}
        />
        <Field
          component={SelectField}
          name="status"
          placeholder="Status"
          options={['In-use', 'New', 'Stopped']}
          validate={required}
        />
        <Field
          component={MultiplelValuesField}
          name="cargorType"
          placeholder="Cargor Type (Enter to create new)"
          autoComplete={this.handleAutoCargorType}
          validate={combine(required, maxLength(10))}
        />
        <Field component={InputField} name="driver" placeholder="Driver" autoComplete={this.handleAutoDriver} />
        <Field component={InputField} name="truckYear" placeholder="Product Year" validate={number} />
        <Field component={InputField} name="truckType" placeholder="Truck Type (ton)" validate={number} />
        <Field component={InputField} name="price" placeholder="Price" validate={combine(required, number)} />
        <BsForm.Row>
          <Field component={InputField} name="length" placeholder="Length" as={Col} md={4} validate={number} />
          <Field component={InputField} name="width" placeholder="Width" as={Col} md={4} validate={number} />
          <Field component={InputField} name="height" placeholder="Height" as={Col} md={4} validate={number} />
        </BsForm.Row>
        <Field
          component={TextareField}
          name="packingAddr"
          placeholder="Packing Address ..."
          validate={maxLength(500)}
          maxLength={500}
        />
        <Field
          component={TextareField}
          name="description"
          placeholder="Description ..."
          validate={maxLength(200)}
          maxLength={200}
        />
      </Form>
    )
  }
}

export default class UpsertTruckModal extends Component {
  editModal = React.createRef()
  form = React.createRef()
  show = () => {
    this.editModal.current.show()
  }
  submit = () => this.form.current.submit()

  render() {
    const { truck, title, ...props } = this.props
    return (
      <GenericModal ref={this.editModal} title={title} onConfirm={this.submit}>
        <UpsertTruckForm truck={truck} {...props} formRef={this.form} />
      </GenericModal>
    )
  }
}
