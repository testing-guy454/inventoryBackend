const jwt = require('jsonwebtoken')

const { UnauthorizedError } = require('../errors/client.error')
const { JWT_SECRET_KEY } = require('../config/server.config')
const logger = require('../utils/logger')
const { BaseError } = require('../errors')

const CONTEXT = 'AdminAuthMiddleware'

const adminMiddleware = (req, res, next) => {

  const authHeader = req.headers['authorization']
  const token = req.cookies.token || ((authHeader && authHeader.startsWith('Bearer ')) ? authHeader.split(' ')[1] : null)
  logger.info(`[${CONTEXT}] Authenticating admin for ${req.method} ${req.originalUrl} | Token present: ${!!token}`)
  if(!token) {
    logger.error(`[${CONTEXT}] No token provided for admin route ${req.method} ${req.originalUrl}`)
    throw new UnauthorizedError('No Token Provided')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY)
    if(decoded.role != 'admin') {
      logger.error(`[${CONTEXT}] Non-admin access attempt by userId: ${decoded.userId} for ${req.method} ${req.originalUrl}`)
      throw new UnauthorizedError('Only Admin can Do this Operation!')
    }
    req.userId = decoded.userId
    logger.info(`[${CONTEXT}] Admin authentication successful for userId: ${decoded.userId}`)
    next()

  } catch (error) {
    logger.error(`[${CONTEXT}] Invalid or expired token for admin route ${req.method} ${req.originalUrl}`, error)
    if(error instanceof BaseError) throw error
    throw new UnauthorizedError('Invalid or expired Token Provided')
  }
}

module.exports = adminMiddleware