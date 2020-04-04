import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

class SelectField extends Component {
  render() {
    const { input, error, touched, placeholder, label, as, md, xs, lg, options = [] } = this.props
    const bs = { as, md, xs, lg }
    return (
      <Form.Group {...bs}>
        {label && <Form.Label>{label}</Form.Label>}
        <InputGroup>
          <Form.Control as="select" {...input} isInvalid={touched && error}>
            <option value="">{placeholder || 'Select'}</option>
            {options.map(o => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Form.Control>
          {touched && error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        </InputGroup>
      </Form.Group>
    )
  }
}

export default SelectField
