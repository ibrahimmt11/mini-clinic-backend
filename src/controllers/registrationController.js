const { Registration, Queue, Patient, Doctor, Polyclinic, sequelize } = require('../models');
const { success } = require('../utils/response');
const ApiError = require('../utils/ApiError');

async function generateQueueNumber(queueDate) {
  const lastQueue = await Queue.findOne({
    where: { queueDate },
    order: [['queueNumber', 'DESC']],
  });

  let nextNumber = 1;
  if (lastQueue) {
    const lastNumber = parseInt(lastQueue.queueNumber.replace('A', ''), 10);
    nextNumber = lastNumber + 1;
  }

  return `A${String(nextNumber).padStart(3, '0')}`;
}

async function getAll(req, res, next) {
  try {
    const { status, visitDate } = req.query;
    const where = {};
    if (status) where.status = status;
    if (visitDate) where.visitDate = visitDate;

    const registrations = await Registration.findAll({
      where,
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' },
        { model: Polyclinic, as: 'polyclinic' },
        { model: Queue, as: 'queue' },
      ],
      order: [['createdAt', 'DESC']],
    });

    return success(res, registrations);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { patientId, doctorId, polyclinicId, visitDate, paymentType, initialComplaint } = req.body;

    if (!patientId || !doctorId || !polyclinicId || !visitDate || !paymentType) {
      throw new ApiError(422, 'Validation Error', {
        patientId: !patientId ? 'Pasien wajib dipilih' : undefined,
        doctorId: !doctorId ? 'Dokter wajib dipilih' : undefined,
        polyclinicId: !polyclinicId ? 'Poli wajib dipilih' : undefined,
        visitDate: !visitDate ? 'Tanggal kunjungan wajib diisi' : undefined,
        paymentType: !paymentType ? 'Jenis pembayaran wajib diisi' : undefined,
      });
    }

    const registration = await Registration.create(
      {
        patientId,
        doctorId,
        polyclinicId,
        visitDate,
        paymentType,
        initialComplaint,
        status: 'Menunggu',
      },
      { transaction: t }
    );

    const queueNumber = await generateQueueNumber(visitDate);

    const queue = await Queue.create(
      {
        registrationId: registration.id,
        queueNumber,
        queueDate: visitDate,
        status: 'Menunggu',
      },
      { transaction: t }
    );

    await t.commit();

    return success(
      res,
      { registration, queue },
      'Pendaftaran berhasil, nomor antrean digenerate',
      201
    );
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ['Menunggu', 'Check In', 'Pemeriksaan', 'Selesai'];

    if (!status || !validStatuses.includes(status)) {
      throw new ApiError(422, 'Validation Error', {
        status: `Status harus salah satu dari: ${validStatuses.join(', ')}`,
      });
    }

    const registration = await Registration.findByPk(req.params.id);
    if (!registration) throw new ApiError(404, 'Pendaftaran tidak ditemukan');

    await registration.update({ status });
    return success(res, registration, 'Status pendaftaran berhasil diperbarui');
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create, updateStatus };