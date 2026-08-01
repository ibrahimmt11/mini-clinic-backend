const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { success } = require('../utils/response');
const ApiError = require('../utils/ApiError');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ApiError(422, 'Validation Error', {
        username: !username ? 'Username wajib diisi' : undefined,
        password: !password ? 'Password wajib diisi' : undefined,
      });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new ApiError(401, 'Username atau password salah');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Username atau password salah');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return success(res, {
      token,
      user: { id: user.id, username: user.username, name: user.name, role: user.role },
    }, 'Login berhasil');
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    return success(res, {}, 'Logout berhasil');
  } catch (err) {
    next(err);
  }
}

module.exports = { login, logout };