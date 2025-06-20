/**
 * Common Zod middleware where you can pass any Schema to be parsed
 * Dependency Injection is Used in Routes
 */

const { ClientError } = require("../errors")
const logger = require("../utils/logger")

const CONTEXT = 'ZodValidator'

const validator = (schema) => (req, res, next) => {
  logger.info(`[${CONTEXT}] Validating request body for ${req.method} ${req.originalUrl}: ${JSON.stringify(req.body)}`)
  try {
    const { success, data, error } = schema.safeParse(req.body)
    if(!success) {
      logger.error(`[${CONTEXT}] Validation failed for ${req.method} ${req.originalUrl}: ${error}`)
      throw new ClientError.BadRequestError('Invalid request body.', error.errors || error)
    }

    req.userData = data
    logger.info(`[${CONTEXT}] Validation passed for ${req.method} ${req.originalUrl}`)
    next()

  } catch (err) {
    logger.error(`[${CONTEXT}] Invalid Request Params Received for ${req.method} ${req.originalUrl}`, err)
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        name: err.name,
        details: err.meta || []
      }
    })
  }
}

module.exports = validator