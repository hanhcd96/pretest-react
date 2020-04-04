export const combine = (...validations) => value => {
  for (const validate of validations) {
    if (typeof validate === 'function') {
      const error = validate(value)
      if (error) return error
    }
  }
}

export const required = value => {
  if (!value || value.length === 0) return 'Required'
}

export const number = value => {
  if (value && isNaN(Number(value))) return 'Invalid Number'
}

export const maxLength = max => value => {
  if (value && value.length > max) return `Max length is ${max}`
}
export const licensePlate = value => {
  if (!/^[1-9]{1}[0-9]{1}[A-Z]{1}-\d{5}$/.test(value)) return 'License Plate wrong format (30A-12345)'
}
