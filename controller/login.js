const express = require('express')
const User = require('../models/user')
const auth = require('../utils/auth')

const loginRouter = express.Router()

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  // Slow hashing is what prevents someone who has hashes brute forcing logins outside of system
  // EVEN IF an attacker has
  const correctPassword = user ? await auth.isCorrectPassword(password, user.passwordHash) : false
  if (!correctPassword) {
    return response.status(401).json({ error: 'Invalid credentials' })
  }
  const token = auth.generateToken(user)
  response.status(200).send({ token: token, username: username })
})

module.exports = loginRouter