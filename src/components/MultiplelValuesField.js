import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Dropdown from 'react-bootstrap/Dropdown'

const uniq = array => [...new Set(array)]
const difference = (...arrays) => arrays.reduce((a, b) => a.filter(c => !b.includes(c)))

class MultiplelValuesField extends Component {
  state = { autoCompleteOptions: [], value: '' }

  onSelect = value => {
    const { input } = this.props
    const currentValue = input.value || []
    input.onChange(uniq([...currentValue, value]))
  }
  onRemove = value => {
    const { input } = this.props
    const currentValue = input.value || []
    input.onChange(currentValue.filter(o => o !== value))
  }
  _onFocus = e => {
    const { input, autoComplete } = this.props
    if (typeof autoComplete === 'function') {
      const value = e.target.value || ''
      autoComplete(value).then(autoCompleteOptions =>
        this.setState({ autoCompleteOptions: uniq(difference(autoCompleteOptions, input.value)) })
      )
    }
  }
  _onChange = e => {
    const { autoComplete, input } = this.props
    const value = (e.target && e.target.value) || ''
    this.setState({ value })
    if (typeof autoComplete === 'function') {
      if (this.searching) clearTimeout(this.searching)
      this.searching = setTimeout(
        () =>
          autoComplete(value).then(autoCompleteOptions =>
            this.setState({ autoCompleteOptions: uniq(difference(autoCompleteOptions, input.value)) })
          ),
        500
      )
    }
  }
  _onKeyDown = e => {
    const value = e.target && e.target.value
    if (value && e.keyCode === 13) {
      this.onSelect(value)
      this._onChange('')
      this.setState({ value: '' })
    }
  }
  render() {
    const { autoCompleteOptions } = this.state
    const { input, error, touched, placeholder, label, autoComplete, as, md, xs, lg } = this.props
    const bs = { as, md, xs, lg }
    const value = input.value || []
    return (
      <Form.Group {...bs}>
        {label && <Form.Label>{label}</Form.Label>}

        <InputGroup>
          {value.length > 0 && (
            <div className="d-flex flex-wrap mb-2">
              {value.map(o => (
                <span key={o} className="item-value mr-2">
                  <span className="mr-1">{o}</span>
                  <i className="fas fa-times-circle clickable text-danger" onClick={() => this.onRemove(o)} />
                </span>
              ))}
            </div>
          )}
          {autoComplete ? (
            <Dropdown className="w-100">
              <Dropdown.Toggle as="div" className="input-dropdown">
                <Form.Control
                  type="text"
                  value={this.state.value}
                  placeholder={placeholder}
                  name={input.name}
                  onChange={this._onChange}
                  onFocus={this._onFocus}
                  onBlur={input.onBlur}
                  onKeyDown={this._onKeyDown}
                  isInvalid={touched && error}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100">
                {autoCompleteOptions.map(o => (
                  <Dropdown.Item key={o} eventKey={o} onSelect={this.onSelect}>
                    {o}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Form.Control
              type="text"
              value={this.state.value}
              placeholder={placeholder}
              name={input.name}
              onChange={this._onChange}
              onFocus={this._onFocus}
              onBlur={input.onBlur}
              onKeyDown={this._onKeyDown}
              isInvalid={touched && error}
            />
          )}

          {touched && error && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {error}
            </Form.Control.Feedback>
          )}
        </InputGroup>
      </Form.Group>
    )
  }
}

export default MultiplelValuesField
