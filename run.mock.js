const open = require('open')
const jsonServer = require('json-server')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHot = require('webpack-hot-middleware')
const compiler = webpack(require('./webpack.config'))
const devMode = process.env.NODE_ENV !== 'production'

const random = (min, max, floating) => (Math.random() * (max - min) + min).toFixed(floating ? 4 : 0)

const sample = arr => {
  const len = arr == null ? 0 : arr.length
  return len ? arr[Math.floor(Math.random() * len)] : undefined
}
const pickMultiRandom = (items, max) => {
  items = items.slice(0)
  var newItems = []
  max = max ? max : random(1, items.length)
  for (var i = 0; i < max; i++) {
    var idx = Math.floor(Math.random() * items.length)
    newItems.push(items[idx])
    items.splice(idx, 1)
  }
  return newItems
}

const data = { trucks: [] }
for (let id = 1; id < 1000; id++) {
  const truckPlate = `30A-${11111 + id}`
  const driver = [sample(['Nguyễn', 'Lê', 'Trần']), sample(['Văn', 'Duy', 'Thế', 'Quốc', 'Gia']), 'A' + id].join(' ')
  const cargorType = pickMultiRandom(['Computer', 'Electronic', 'Vegetable', 'Kid toys'])
  const truckType = sample([1.2, 1.5, 2, 5, 10, 15, 20, 25])
  const truckYear = random(2000, new Date().getFullYear())
  const price = random(1000, 10000) * 1000000
  const width = random(2, 4, true)
  const height = random(2, 3, true)
  const length = random(5, 13, true)
  const packingAddr = sample(['No. 128, Hoàn Kiếm street, Hà Nội', 'No. 110, Cầu Giấy street, Hà Nội'])
  const status = sample(['In-use', 'New', 'Stopped'])
  data.trucks.push({
    id,
    driver,
    truckPlate,
    cargorType,
    truckYear,
    truckType,
    price,
    width,
    height,
    length,
    packingAddr,
    status
  })
}

const server = jsonServer.create()
const router = jsonServer.router(data)

if (devMode) {
  server.use(webpackMiddleware(compiler))
  server.use(webpackHot(compiler))
} else {
  server.use(
    jsonServer.defaults({
      static: 'dist'
    })
  )
}
server.use('/api', router)
server.listen(3333, () => {
  console.log('Server is running at: http://localhost:3333')
  open('http://localhost:3333')
})
