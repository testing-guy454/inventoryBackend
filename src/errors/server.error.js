const BaseError = require('./base.error')

class InternalServerError extends BaseError {
  constructor(description = 'Internal Server Error', meta = {}) {
    super('InternalServerError', 500, description, false, meta)
  }
}

class NotImplementedError extends BaseError {
  constructor(description = 'Not Implemented', meta = {}) {
    super('NotImplementedError', 501, description, false, meta)
  }
}

class BadGatewayError extends BaseError {
  constructor(description = 'Bad Gateway', meta = {}) {
    super('BadGatewayError', 502, description, false, meta)
  }
}

class ServiceUnavailableError extends BaseError {
  constructor(description = 'Service Unavailable', meta = {}) {
    super('ServiceUnavailableError', 503, description, false, meta)
  }
}

class GatewayTimeoutError extends BaseError {
  constructor(description = 'Gateway Timeout', meta = {}) {
    super('GatewayTimeoutError', 504, description, false, meta)
  }
}

module.exports = {
  InternalServerError,
  NotImplementedError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError
}