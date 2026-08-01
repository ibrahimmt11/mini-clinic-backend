const { Op } = require('sequelize');
const { Patient } = require('../models');
const { success } = require('../utils/response');
const ApiError = require('../utils/ApiError');

async function generateMedicalRecordNumber() {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');
  const count = await Patient.count();
  const sequence = String(count + 1).padStart(4, '0');
  return `RM-${datePart}-${sequence}`;
}

async function getAll(req, res, next) {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { nik: { [Op.iLike]: `%${search}%` } },
            { medicalRecordNumber: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await Patient.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    return success(res, {
      patients: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) throw new ApiError(404, 'Pasien tidak ditemukan');
    return success(res, patient);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { nik, name, gender, birthDate, phoneNumber, address } = req.body;

    if (!nik || !name || !gender || !birthDate || !phoneNumber) {
      throw new ApiError(422, 'Validation Error', {
        nik: !nik ? 'NIK wajib diisi' : undefined,
        name: !name ? 'Nama wajib diisi' : undefined,
        gender: !gender ? 'Jenis kelamin wajib diisi' : undefined,
        birthDate: !birthDate ? 'Tanggal lahir wajib diisi' : undefined,
        phoneNumber: !phoneNumber ? 'Nomor telepon wajib diisi' : undefined,
      });
    }

    const existing = await Patient.findOne({ where: { nik } });
    if (existing) {
      throw new ApiError(422, 'Validation Error', { nik: 'NIK sudah terdaftar' });
    }

    const medicalRecordNumber = await generateMedicalRecordNumber();

    const patient = await Patient.create({
      medicalRecordNumber,
      nik,
      name,
      gender,
      birthDate,
      phoneNumber,
      address,
    });

    return success(res, patient, 'Pasien berhasil ditambahkan', 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) throw new ApiError(404, 'Pasien tidak ditemukan');

    const { nik } = req.body;
    if (nik && nik !== patient.nik) {
      const existing = await Patient.findOne({ where: { nik } });
      if (existing) {
        throw new ApiError(422, 'Validation Error', { nik: 'NIK sudah terdaftar' });
      }
    }

    await patient.update(req.body);
    return success(res, patient, 'Pasien berhasil diperbarui');
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) throw new ApiError(404, 'Pasien tidak ditemukan');

    await patient.destroy();
    return success(res, {}, 'Pasien berhasil dihapus');
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };