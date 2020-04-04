import React, { Component } from 'react'
import BsForm from 'react-bootstrap/Form'
import PropTypes from 'prop-types'
const FormContext = React.createContext()

class FieldRaw extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    validate: PropTypes.func,
    component: PropTypes.func.isRequired
  }
  state = { touched: false }
  componentDidMount() {
    const { name, validate } = this.props
    this.props.register(name, validate)
  }
  componentWillUnmount() {
    const { name } = this.props
    this.props.unregister(name)
  }

  _onChange = e => {
    const { name } = this.props
    if (e && e.target) {
      this.props.change(name, e.target.value)
    } else {
      this.props.change(name, e)
    }
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e)
    }
  }
  _onBlur = e => {
    const { name } = this.props
    if (!this.state.touched && typeof this.props.blur === 'function') {
      this.props.blur(name)
    }
    if (typeof this.props.onBlur === 'function') {
      this.props.onFocus(e)
    }
  }
  render() {
    const { name, component, values, touches, errors, ...props } = this.props
    const FieldComponent = component || 'input'
    const input = { name, onChange: this._onChange, onBlur: this._onBlur, value: values[name] || '' }
    return <FieldComponent input={input} touched={touches[name]} error={errors[name]} {...props} />
  }
}
export const Field = props => (
  <FormContext.Consumer>{context => <FieldRaw {...props} {...context} />}</FormContext.Consumer>
)

class Form extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    validate: PropTypes.func,
    onSubmit: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      values: props.initialValues || {},
      errors: {},
      touches: {},
      change: this.change,
      blur: this.blur,
      register: this.register,
      unregister: this.unregister
    }
  }
  fieldsValidate = {}
  fields = {}

  validate = values => {
    let errors = typeof this.props.validate === 'function' ? this.props.validate() : {}
    Object.keys(this.fieldsValidate).map(field => {
      const fieldValidate = this.fieldsValidate[field]
      errors[field] = fieldValidate(values[field])
    })
    return errors
  }

  // I can change this behavior to subscribe for performance, but not in this test :D
  change = (field, value) => {
    let values = this.state.values || {}
    values = { ...values, [field]: isNaN(Number(value)) ? value : Number(value) }
    const errors = this.validate(values)
    this.setState({ values, errors })
  }
  blur = field => {
    let touches = this.state.touches || {}
    if (touches[field]) return
    touches = { ...touches, [field]: true }
    const errors = this.validate(this.state.values)
    this.setState({ touches, errors })
  }
  register = (field, fieldValidate) => {
    if (typeof fieldValidate === 'function') this.fieldsValidate[field] = fieldValidate
    this.fields[field] = true
  }
  unregister = field => {
    this.fieldsValidate[field] = undefined
    this.fields[field] = undefined
  }
  _onSubmit = e => {
    const { onSubmit } = this.props
    const { values } = this.state
    const errors = this.validate(values)
    const check = Object.keys(errors).filter(o => errors[o])
    if (typeof onSubmit === 'function' && check.length === 0) {
      e && e.preventDefault && e.preventDefault()
      return onSubmit(values)
    } else {
      this.setState({ errors, touches: this.fields })
      return Promise.reject(errors)
    }
  }
  submit = this._onSubmit
  render() {
    const { name } = this.props
    return (
      <FormContext.Provider value={this.state}>
        <BsForm name={name} onSubmit={this._onSubmit} autoComplete="off">
          {this.props.children}
        </BsForm>
      </FormContext.Provider>
    )
  }
}

export default Form
