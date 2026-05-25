/**
 * Standard API Response class for consistent response formatting
 */
class ApiResponse {
  constructor(statusCode, data, message = null) {
    this.success = statusCode < 400;
    this.data = data;
    if (message) {
      this.message = message;
    }
  }

  /**
   * Send success response
   */
  static success(res, data, message = null, statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
  }

  /**
   * Send created response (201)
   */
  static created(res, data, message = 'Resource created successfully') {
    return res.status(201).json(new ApiResponse(201, data, message));
  }

  /**
   * Send paginated response
   */
  static paginated(res, data, pagination, message = null) {
    const response = new ApiResponse(200, data, message);
    response.pagination = pagination;
    return res.status(200).json(response);
  }
}

module.exports = ApiResponse;
