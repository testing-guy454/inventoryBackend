const BaseError = require('./base.error')

class BadRequestError extends BaseError {
  constructor(description = 'Bad Request', meta = {}) {
    super('BadRequestError', 400, description, meta)
  }
}

class UnauthorizedError extends BaseError {
  constructor(description = 'Unauthorized', meta = {}) {
    super('UnauthorizedError', 401, description, meta)
  }
}

class ForbiddenError extends BaseError {
  constructor(description = 'Forbidden', meta = {}) {
    super('ForbiddenError', 403, description, meta)
  }
}

class NotFoundError extends BaseError {
  constructor(description = 'Not Found', meta = {}) {
    super('NotFoundError', 404, description, meta)
  }
}

class MethodNotAllowedError extends BaseError {
  constructor(description = 'Method Not Allowed', meta = {}) {
    super('MethodNotAllowedError', 405, description, meta)
  }
}

class NotAcceptableError extends BaseError {
  constructor(description = 'Not Acceptable', meta = {}) {
    super('NotAcceptableError', 406, description, meta)
  }
}

class ConflictError extends BaseError {
  constructor(description = 'Conflict', meta = {}) {
    super('ConflictError', 409, description, meta)
  }
}

class GoneError extends BaseError {
  constructor(description = 'Gone', meta = {}) {
    super('GoneError', 410, description, meta)
  }
}

class UnsupportedMediaTypeError extends BaseError {
  constructor(description = 'Unsupported Media Type', meta = {}) {
    super('UnsupportedMediaTypeError', 415, description, meta)
  }
}

class UnprocessableEntityError extends BaseError {
  constructor(description = 'Unprocessable Entity', meta = {}) {
    super('UnprocessableEntityError', 422, description, meta)
  }
}

class TooManyRequestsError extends BaseError {
  constructor(description = 'Too Many Requests', meta = {}) {
    super('TooManyRequestsError', 429, description, meta)
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  NotAcceptableError,
  ConflictError,
  GoneError,
  UnsupportedMediaTypeError,
  UnprocessableEntityError,
  TooManyRequestsError
}