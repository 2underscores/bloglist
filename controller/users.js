const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const logger = require('../utils/logger')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')

const userRouter = express.Router()

// Your route handlers will go here

const extractTokenFromRequest = (req) => {
  const authHeader = req.header('authorization')
  const validHeader = (authHeader && authHeader.startsWith('Bearer'))
  return validHeader ? authHeader.replace('Bearer ', '') : null
}

const decodeToken = (tokenStr) => {
  return jwt.verify(tokenStr, config.AUTH_SECRET)
}

const tokenIsValid = (token) => {
  if (!token.id) {
    return false
  }
  return true
}

const getValidToken = (req) => {
  const tokenStr = extractTokenFromRequest(req)
  if (tokenStr) {
    const token = decodeToken(tokenStr)
    if (token && tokenIsValid(token)) {
      return token
    }
  }
  throw { name: "InvalidToken", message: "Token in auth header is invalid" }
}

userRouter.get('/', async (request, response) => {
  const token = getValidToken(request)
  const users = await User.find({}).populate('blogs')
  response.json(users)

})

userRouter.post('/', async (request, response) => {
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
