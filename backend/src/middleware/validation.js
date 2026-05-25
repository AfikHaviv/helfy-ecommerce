const ApiError = require('../utils/ApiError');

/**
 * Validation middleware factory
 * @param {object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      throw ApiError.badRequest(
        'Validation failed',
        'VALIDATION_ERROR',
        details
      );
    }

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
};

/**
 * Validate query parameters
 * @param {object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      throw ApiError.badRequest(
        'Query validation failed',
        'VALIDATION_ERROR',
        details
      );
    }

    // Replace req.query with validated value
    req.query = value;
    next();
  };
};

/**
 * Validate route parameters
 * @param {object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      throw ApiError.badRequest(
        'Parameter validation failed',
        'VALIDATION_ERROR',
        details
      );
    }

    // Replace req.params with validated value
    req.params = value;
    next();
  };
};

module.exports = { validate, validateQuery, validateParams };
