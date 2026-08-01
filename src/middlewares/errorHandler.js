const ApiError = require('../utils/ApiError');

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = {};
    err.errors.forEach((e) => {
      errors[e.path] = e.message;
    });
    return res.status(422).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    errors: {},
  });
}

function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: {},
  });
}

module.exports = { errorHandler, notFoundHandler };