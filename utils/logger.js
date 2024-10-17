const config = require('../utils/config')
const info = (...params) => {
  if (config.ENV === 'test') { return }
  console.log(...params)
}
const error = (...params) => {
  // if (config.ENV === 'test') { return }
  console.error(...params)
}
module.exports = { info, error }