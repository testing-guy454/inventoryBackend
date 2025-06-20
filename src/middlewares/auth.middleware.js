const jwt = require('jsonwebtoken')

const { UnauthorizedError } = require('../errors/client.error')
const { JWT_SECRET_KEY } = require('../config/server.config')
const logger = require('../utils/logger')

const CONTEXT = 'AuthMiddleware'

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers['authorization']
  const token = req.cookies.token || ((authHeader && authHeader.startsWith('Bearer ')) ? authHeader.split(' ')[1] : null)
  logger.info(`[${CONTEXT}] Authenticating request for ${req.method} ${req.originalUrl} | Token present: ${!!token}`)
  if(!token) {
    logger.error(`[${CONTEXT}] No token provided for ${req.method} ${req.originalUrl}`)
    throw new UnauthorizedError('No Token Provided')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY)
    req.userId = decoded.userId
    logger.info(`[${CONTEXT}] Authentication successful for userId: ${decoded.userId}`)
    next()

  } catch (error) {
    logger.error(`[${CONTEXT}] Invalid or expired token for ${req.method} ${req.originalUrl}`, error)
    throw new UnauthorizedError('Invalid or expired Token Provided')
  }
}

module.exports = authMiddleware