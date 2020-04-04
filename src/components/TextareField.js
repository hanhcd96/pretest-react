import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

class TextareField extends Component {
  render() {
    const { input, error, touched, placeholder, label, maxLength, as, md, xs, lg, rows } = this.props
    const bs = { as, md, xs, lg }
    const valueLength = (input.value && input.value.length) || 0
    return (
      <Form.Group {...bs}>
        {label && <Form.Label>{label}</Form.Label>}

        <InputGroup>
          <Form.Control
            as="textarea"
            rows={rows || 3}
            placeholder={placeholder}
            {...input}
            isInvalid={touched && error}
          />
          <div className="d-flex justify-content-between w-100">
            {error && (
              <Form.Control.Feedback type="invalid" className="invalid-textare w-75">
                {error}
              </Form.Control.Feedback>
            )}
            {maxLength && <span>{`${valueLength} / ${maxLength}`}</span>}
          </div>
        </InputGroup>
      </Form.Group>
    )
  }
}

export default TextareField
