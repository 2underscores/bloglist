require('dotenv').config()

module.exports = {
  PORT: process.env.PORT,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_CLUSTER: process.env.MONGO_CLUSTER,
  MONGO_TABLE: process.env.MONGO_TABLE
}