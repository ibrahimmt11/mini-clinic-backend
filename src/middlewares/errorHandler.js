const ApiError = require('../utils/ApiError');

function errorHandler(err, req, res, next) {
  console.error(err);

  // Custom application errors (thrown intentionally via ApiError)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Foreign key constraint violations (e.g. deleting a record still referenced elsewhere)
  if (
    err.name === 'SequelizeForeignKeyConstraintError' ||
    (err.name === 'SequelizeDatabaseError' && err.parent?.code === '23001') ||
    (err.name === 'SequelizeDatabaseError' && err.parent?.code === '23503')
  ) {
    return res.status(409).json({
      success: false,
      message: 'Data tidak dapat dihapus karena masih terkait dengan data lain (misal riwayat pendaftaran/pemeriksaan)',
      errors: {},
    });
  }

  // Sequelize model validation errors (e.g. NIK duplicate, required field missing)
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

  // Fallback for any unhandled error
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