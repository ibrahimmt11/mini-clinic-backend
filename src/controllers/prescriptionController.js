const { Prescription, MedicalRecord } = require('../models');
const { success } = require('../utils/response');
const ApiError = require('../utils/ApiError');

// POST /prescriptions -> tambah resep tunggal ke medical record yang sudah ada
async function create(req, res, next) {
  try {
    const { medicalRecordId, medicineName, dosage, instructions } = req.body;

    if (!medicalRecordId || !medicineName || !dosage) {
      throw new ApiError(422, 'Validation Error', {
        medicalRecordId: !medicalRecordId ? 'Rekam medis wajib diisi' : undefined,
        medicineName: !medicineName ? 'Nama obat wajib diisi' : undefined,
        dosage: !dosage ? 'Dosis wajib diisi' : undefined,
      });
    }

    const medicalRecord = await MedicalRecord.findByPk(medicalRecordId);
    if (!medicalRecord) throw new ApiError(404, 'Rekam medis tidak ditemukan');

    const prescription = await Prescription.create({
      medicalRecordId,
      medicineName,
      dosage,
      instructions,
    });

    return success(res, prescription, 'Resep berhasil ditambahkan', 201);
  } catch (err) {
    next(err);
  }
}

// GET /prescriptions/:id -> detail resep berdasarkan id resep
async function getById(req, res, next) {
  try {
    const prescription = await Prescription.findByPk(req.params.id);
    if (!prescription) throw new ApiError(404, 'Resep tidak ditemukan');

    return success(res, prescription);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getById };