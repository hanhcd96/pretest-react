// import { validateTruck } from './validations'
import Axios from 'axios'
const operators = ['_gte', '_lte', '_ne', '_like']

export const findTruck = query => {
  query = query || {}
  const { _sort, _order, _page = 1, _limit = 10 } = query
  const params = Object.keys(query).reduce((result, key) => {
    let value = query[key]
    if (typeof value === 'object' && operators.includes(Object.keys(value)[0])) {
      result[`${key}${Object.keys(value)[0]}`] = value[Object.keys(value)[0]]
    } else {
      result[key] = value
    }
    return result
  }, {})
  return Axios('/api/trucks', { params: { ...params, _sort, _order, _page, _limit } }).then(response => {
    const xCount = Number(response.headers['x-total-count'])
    return {
      data: response.data,
      totalPages: Math.ceil(xCount / _limit)
    }
  })
}
export const deleteTruck = id => Axios(`/api/trucks/${id}`, { method: 'DELETE' }).then(() => id)

export const upsertTruck = data => {
  if (data.id) return Axios(`/api/trucks/${data.id}`, { method: 'PATCH', data }).then(response => response.data)
  return Axios(`/api/trucks`, { method: 'POST', data }).then(response => response.data)
}
