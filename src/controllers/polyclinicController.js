const { Polyclinic } = require('../models');
const { success } = require('../utils/response');
const ApiError = require('../utils/ApiError');

async function getAll(req, res, next) {
  try {
    const polyclinics = await Polyclinic.findAll({ order: [['name', 'ASC']] });
    return success(res, polyclinics);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) throw new ApiError(422, 'Validation Error', { name: 'Nama poli wajib diisi' });

    const polyclinic = await Polyclinic.create({ name });
    return success(res, polyclinic, 'Poli berhasil ditambahkan', 201);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create };