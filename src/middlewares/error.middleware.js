const { StatusCodes } = require('http-status-codes')

const logger = require('../utils/logger')
const { BaseError } = require('../errors')
const ApiResponse = require('../dto/response.dto')

const CONTEXT = 'ErrorMiddleware'

const errorMw = (err, req, res, next) => {

  logger.error(`[${CONTEXT}] ${err.name}: ${err.message}`, {
    stack: err.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body
    }
  })

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message, {
        name: err.name,
        details: err.meta || []
      })
    )
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
    ApiResponse.error('An unexpected internal server error occurred.', {
      name: 'InternalServerError',
      details: []
    })
  )
}

module.exports = errorMw