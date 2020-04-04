import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Dropdown from 'react-bootstrap/Dropdown'

class InputField extends Component {
  state = { autoCompleteOptions: [] }
  _onFocus = e => {
    const { input, autoComplete } = this.props
    if (typeof input.onFocus === 'function') {
      input.onFocus(e)
    }
    if (typeof autoComplete === 'function') {
      autoComplete(input.value).then(autoCompleteOptions => this.setState({ autoCompleteOptions }))
    }
  }
  _onChange = e => {
    const { input, autoComplete } = this.props
    input.onChange(e)
    if (typeof autoComplete === 'function') {
      const value = (e.target && e.target.value) || e
      if (this.searching) clearTimeout(this.searching)
      this.searching = setTimeout(
        () => autoComplete(value).then(autoCompleteOptions => this.setState({ autoCompleteOptions })),
        500
      )
    }
  }
  render() {
    const { autoCompleteOptions } = this.state
    const { input, error, touched, placeholder, label, prepend, append, autoComplete, as, md, xs, lg } = this.props
    const bs = { as, md, xs, lg }
    const extHook = {}
    if (autoComplete) {
      extHook.onFocus = this._onFocus
      extHook.onChange = this._onChange
    }
    return (
      <Form.Group {...bs}>
        {label && <Form.Label>{label}</Form.Label>}

        <InputGroup>
          {prepend && (
            <InputGroup.Prepend>
              <InputGroup.Text>{prepend}</InputGroup.Text>
            </InputGroup.Prepend>
          )}
          {autoComplete ? (
            <Dropdown className="w-100">
              <Dropdown.Toggle as="div" className="input-dropdown">
                <Form.Control
                  type="text"
                  placeholder={placeholder}
                  {...input}
                  {...extHook}
                  isInvalid={touched && error}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100">
                {autoCompleteOptions.map(o => (
                  <Dropdown.Item key={o} eventKey={o} onSelect={this._onChange}>
                    {o}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Form.Control type="text" placeholder={placeholder} {...input} {...extHook} isInvalid={touched && error} />
          )}
          {append && (
            <InputGroup.Append>
              <InputGroup.Text>{append}</InputGroup.Text>
            </InputGroup.Append>
          )}

          {touched && error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        </InputGroup>
      </Form.Group>
    )
  }
}

export default InputField
