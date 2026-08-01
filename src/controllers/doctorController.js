const { Doctor, Polyclinic } = require('../models');
const { success } = require('../utils/response');
const ApiError = require('../utils/ApiError');

async function getAll(req, res, next) {
  try {
    const doctors = await Doctor.findAll({
      include: [{ model: Polyclinic, as: 'polyclinic' }],
      order: [['name', 'ASC']],
    });
    return success(res, doctors);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { userId, name, polyclinicId } = req.body;
    if (!userId || !name || !polyclinicId) {
      throw new ApiError(422, 'Validation Error', {
        userId: !userId ? 'User ID wajib diisi' : undefined,
        name: !name ? 'Nama dokter wajib diisi' : undefined,
        polyclinicId: !polyclinicId ? 'Poli wajib diisi' : undefined,
      });
    }

    const doctor = await Doctor.create({ userId, name, polyclinicId });
    return success(res, doctor, 'Dokter berhasil ditambahkan', 201);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create };