const express = require('express')
const config = require('../utils/config')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const loginRouter = express.Router()

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  // Slow hashing is what prevents someone who has hashes brute forcing logins outside of system
  // EVEN IF an attacker has 
  const correctPassword = user ? await bcrypt.compare(password, user.passwordHash) : false
  if (!correctPassword || !user) {
    return response.status(401).json({ error: 'Invalid credentials' })
  }
  const tokenFields = {
    username: user.username,
    id: user.id
  }
  const token = jwt.sign(tokenFields, config.AUTH_SECRET)
  response.status(200).send({ token: token, username: username })
})

module.exports = loginRouter