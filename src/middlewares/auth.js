const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Unauthorized', { token: 'Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    next(new ApiError(401, 'Unauthorized', { token: 'Token tidak valid atau kadaluarsa' }));
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden', { role: 'Anda tidak memiliki akses ke resource ini' }));
    }
    next();
  };
}

module.exports = { authenticate, authorize };