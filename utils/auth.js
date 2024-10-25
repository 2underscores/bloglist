const jwt = require('jsonwebtoken')
const bycrypt = require('bcrypt')
const config = require('./config')

const authMiddleware = async (req, res, next) => {
  // get token from header and add to request params
  const token = await assertValidToken(req)
  req.token = token
  next()
}

// Login
const isCorrectPassword = async (password, hash) => {
  return await bycrypt.compare(password, hash)
}

const assertPasswordCorrect = async (password, hash) => {
  if (!await isCorrectPassword(password, hash)) {
    throw new AuthError('Invalid credentials')
  }
}

const generateToken = (user) => {
  return jwt.sign({
    username: user.username,
    id: user.id
  }, config.AUTH_SECRET)
}

// Auth
const extractTokenFromRequest = (req) => {
  const authHeader = req.header('authorization')
  const validHeader = (authHeader && authHeader.startsWith('Bearer'))
  return validHeader ? authHeader.replace('Bearer ', '') : null
}

const decodeToken = (tokenStr) => {
  return jwt.verify(tokenStr, config.AUTH_SECRET)
}

const validateToken = (token) => {
  if (!token.id) {
    return false
  }
  return true
}

const assertValidToken = (req) => {
  const tokenStr = extractTokenFromRequest(req)
  if (tokenStr) {
    const token = decodeToken(tokenStr)
    if (token && validateToken(token)) {
      return token
    }
  }
  throw new AuthError('Token in auth header is invalid')
}

class AuthError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthError'
  }
}

module.exports = {
  authMiddleware,
  isCorrectPassword,
  assertPasswordCorrect,
  generateToken,
  extractTokenFromRequest,
  decodeToken,
  validateToken,
  assertValidToken,
  AuthError,
}