const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('./config')

const tokenExtractor = async (req, res, next) => {
  // get token from header and add to request params
  const excludedRoutes = [
    { method: 'POST', path: '/api/login' },
    { method: 'POST', path: '/api/users' },
  ]
  for (const route of excludedRoutes) {
    if (req.method === route.method && req.path === route.path) {
      return next()
    }
  }
  req.token = await assertValidToken(req)
  next()
}

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    next()
    return
  }
  req.user = {
    id: req.token.id,
    name: req.token.name,
    username: req.token.username,
  }
  next()
}

// Login/Signup
const hashPassword = async (password) => {
  const passwordHash = await bcrypt.hash(password, config.SALT_ROUNDS)
  return passwordHash
}

const isCorrectPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

const assertPasswordCorrect = async (password, hash) => {
  if (!await isCorrectPassword(password, hash)) {
    throw new AuthError('Invalid credentials')
  }
}

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      username: user.username,
    },
    config.AUTH_SECRET,
    { expiresIn: 15 * 60 }
  )
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
  if (!token.username) {
    return false
  }
  if (!token.exp) {
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
  throw new AuthError('Invalid token')
}

class AuthError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthError'
  }
}

module.exports = {
  tokenExtractor,
  userExtractor,
  hashPassword,
  isCorrectPassword,
  assertPasswordCorrect,
  generateToken,
  extractTokenFromRequest,
  decodeToken,
  validateToken,
  assertValidToken,
  AuthError,
}