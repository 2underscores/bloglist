const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const logger = require('../utils/logger')
const config = require('../utils/config')

const userRouter = express.Router()

// Your route handlers will go here

userRouter.get('/api/users', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

userRouter.post('/api/users', async (request, response) => {
  const body = request.body

  const user = new User({
    username: body.username,
    passwordHash: await bcrypt.hash(body.password, config.SALT_ROUNDS)
  })

  const savedUser = await user.save()
  logger.info(`Created user ${savedUser.username}`, savedUser)
  response.json(savedUser)
})

module.exports = userRouter
