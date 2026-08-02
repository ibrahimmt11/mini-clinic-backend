const {
  MedicalRecord,
  Prescription,
  Patient,
  Doctor,
  Registration,
  sequelize,
} = require("../models");
const { success } = require("../utils/response");
const ApiError = require("../utils/ApiError");

async function create(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const {
      registrationId,
      patientId,
      doctorId,
      complaint,
      bloodPressure,
      temperature,
      weight,
      height,
      diagnosis,
      treatmentPlan,
      medicalAction,
      prescriptions,
    } = req.body;

    if (!registrationId || !patientId || !doctorId) {
      throw new ApiError(422, "Validation Error", {
        registrationId: !registrationId
          ? "Registration wajib diisi"
          : undefined,
        patientId: !patientId ? "Pasien wajib diisi" : undefined,
        doctorId: !doctorId ? "Dokter wajib diisi" : undefined,
      });
    }

    const registration = await Registration.findByPk(registrationId, {
      transaction: t,
    });
    if (!registration) throw new ApiError(404, "Pendaftaran tidak ditemukan");

    const existing = await MedicalRecord.findOne({
      where: { registrationId },
      transaction: t,
    });
    if (existing) {
      throw new ApiError(422, "Validation Error", {
        registrationId: "Rekam medis untuk pendaftaran ini sudah ada",
      });
    }

    const medicalRecord = await MedicalRecord.create(
      {
        registrationId,
        patientId,
        doctorId,
        complaint,
        bloodPressure,
        temperature,
        weight,
        height,
        diagnosis,
        treatmentPlan,
        medicalAction,
      },
      { transaction: t },
    );

    if (Array.isArray(prescriptions) && prescriptions.length > 0) {
      const prescriptionData = prescriptions.map((p) => ({
        medicalRecordId: medicalRecord.id,
        medicineName: p.medicineName,
        dosage: p.dosage,
        instructions: p.instructions,
      }));
      await Prescription.bulkCreate(prescriptionData, { transaction: t });
    }

    await registration.update({ status: "Selesai" }, { transaction: t });

    await t.commit();

    const result = await MedicalRecord.findByPk(medicalRecord.id, {
      include: [{ model: Prescription, as: "prescriptions" }],
    });

    return success(res, result, "Rekam medis berhasil disimpan", 201);
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

// GET /medical-records/:patientId -> riwayat pemeriksaan pasien
async function getByPatient(req, res, next) {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findByPk(patientId);
    if (!patient) throw new ApiError(404, "Pasien tidak ditemukan");

    const records = await MedicalRecord.findAll({
      where: { patientId },
      include: [
        { model: Doctor, as: "doctor" },
        { model: Prescription, as: "prescriptions" },
        { model: Registration, as: "registration" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return success(res, records);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getByPatient };
