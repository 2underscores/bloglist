require('dotenv').config()

const ENV = process.env.NODE_ENV

module.exports = {
  ENV: process.env.NODE_ENV, // Here or another var?
  PORT: process.env.PORT,
  MONGO: {
    USER: process.env.MONGO_USER,
    PASSWORD: process.env.MONGO_PASSWORD,
    CLUSTER: process.env.MONGO_CLUSTER,
    TABLE: ENV === 'test' ? process.env.MONGO_TABLE_TEST : process.env.MONGO_TABLE, //Will be a more re-usable pattern. TODO: don't default prod
  },
  SALT_ROUNDS: ENV === 'test' ? 1 : Number(process.env.SALT_ROUNDS),
  AUTH_SECRET: ENV === 'test' ? 'test_dsfokjasledkqomus' : process.env.AUTH_SECRET
}