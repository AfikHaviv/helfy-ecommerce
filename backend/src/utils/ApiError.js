/**
 * Custom API Error class for consistent error handling
 */
class ApiError extends Error {
  constructor(statusCode, message, code = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a Bad Request (400) error
   */
  static badRequest(message, code = 'BAD_REQUEST', details = null) {
    return new ApiError(400, message, code, details);
  }

  /**
   * Create an Unauthorized (401) error
   */
  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED', details = null) {
    return new ApiError(401, message, code, details);
  }

  /**
   * Create a Forbidden (403) error
   */
  static forbidden(message = 'Forbidden', code = 'FORBIDDEN', details = null) {
    return new ApiError(403, message, code, details);
  }

  /**
   * Create a Not Found (404) error
   */
  static notFound(message = 'Resource not found', code = 'NOT_FOUND', details = null) {
    return new ApiError(404, message, code, details);
  }

  /**
   * Create a Conflict (409) error
   */
  static conflict(message, code = 'CONFLICT', details = null) {
    return new ApiError(409, message, code, details);
  }

  /**
   * Create an Unprocessable Entity (422) error
   */
  static unprocessableEntity(message, code = 'UNPROCESSABLE_ENTITY', details = null) {
    return new ApiError(422, message, code, details);
  }

  /**
   * Create an Internal Server Error (500)
   */
  static internal(message = 'Internal server error', code = 'INTERNAL_ERROR', details = null) {
    return new ApiError(500, message, code, details);
  }
}

module.exports = ApiError;
