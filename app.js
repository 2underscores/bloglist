const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const logger = require('./utils/logger')
const noteRouter = require('./controller/notes')

// Connect to MongoDB
const { MONGO_USER: USER, MONGO_PASSWORD: PASS, MONGO_CLUSTER: CLUSTER, MONGO_TABLE: TABLE } = config
const mongoUrl = `mongodb+srv://${USER}:${PASS}@${CLUSTER}.ljiec.mongodb.net/${TABLE}?retryWrites=true&w=majority&appName=${CLUSTER}`
logger.info('connecting to MongoDB at ', mongoUrl)
mongoose.connect(mongoUrl)
  .then(() => { logger.info('connected to MongoDB)') })
  .catch(error => { logger.info('error connecting to MongoDB:', error.message) })

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(noteRouter)

module.exports = app