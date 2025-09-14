// Response formatter utility
const success = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

const error = (message, statusCode = 500, errors = null) => ({
  success: false,
  message,
  errors,
  statusCode
});

const paginated = (data, page, limit, total) => ({
  success: true,
  data,
  pagination: {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  }
});

module.exports = { success, error, paginated };