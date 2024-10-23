const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const logger = require('./utils/logger')
const blogRouter = require('./controller/blogs')

// Connect to MongoDB
// TODO: Connect in-mem DB if NODE_ENV=test (current a separate table)
const { MONGO } = config
const mongoUrl = `mongodb+srv://${MONGO.USER}:${MONGO.PASSWORD}@${MONGO.CLUSTER}.ljiec.mongodb.net/${MONGO.TABLE}?retryWrites=true&w=majority&appName=${MONGO.CLUSTER}`
logger.info('connecting to MongoDB at ', mongoUrl)
mongoose.connect(mongoUrl)
  .then(() => { logger.info('connected to MongoDB)') })
  .catch(error => { logger.info('error connecting to MongoDB:', error.message) })

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(blogRouter)


const errorMiddleware = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else {
    console.log('Uncaught error:', error)
    next(error)
  }
}


app.use(errorMiddleware)

module.exports = app
