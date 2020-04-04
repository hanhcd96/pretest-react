import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form, { Field } from './Form'
import InputField from './InputField'

class FilterBox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onFilter: PropTypes.func
  }
  render() {
    const { name, onFilter, initialValues } = this.props
    return (
      <Form name={name} onSubmit={onFilter} initialValues={initialValues}>
        <Field component={InputField} name="q" placeholder="Search" append={<i className="fa fa-search" />} />
      </Form>
    )
  }
}

export default FilterBox
