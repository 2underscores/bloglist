const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const logger = require('./utils/logger')
const blogRouter = require('./controller/blogs')
const userRouter = require('./controller/users')
const loginRouter = require('./controller/login')
const { tokenExtractor, userExtractor } = require('./utils/auth')

// Connect to MongoDB
// TODO: Connect in-mem DB if NODE_ENV=test (current a separate table)
const { MONGO } = config
const mongoUrl = `mongodb+srv://${MONGO.USER}:${MONGO.PASSWORD}@${MONGO.CLUSTER}.ljiec.mongodb.net/${MONGO.TABLE}?retryWrites=true&w=majority&appName=${MONGO.CLUSTER}`
logger.info('Salt: ', config.SALT_ROUNDS)
logger.info('connecting to MongoDB at ', mongoUrl)
mongoose.connect(mongoUrl)
  .then(() => { logger.info('connected to MongoDB)') })
  .catch(error => { logger.info('error connecting to MongoDB:', error.message) })

// Middleware
app.use(cors())
app.use(express.json())
if (config.ENV !== 'test') {
  app.use(morgan('tiny'))
}
// app.use(morgan('tiny')) // FIXME: move back to conditional, just here for debugging. Also in logger.js
app.use(tokenExtractor)
app.use(userExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)


const errorMiddleware = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'InvalidToken' || error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else {
    logger.error('Uncaught error:', error)
    next(error)
  }
}


app.use(errorMiddleware)

module.exports = app
