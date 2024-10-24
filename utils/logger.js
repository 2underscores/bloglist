const config = require('../utils/config')
const info = (...params) => {
  if (config.ENV === 'test') { return } // FIXME: Temp uncomment to allow debugging
  console.log(...params)
}
const error = (...params) => {
  if (config.ENV === 'test') { return }
  console.error(...params)
}
module.exports = { info, error }