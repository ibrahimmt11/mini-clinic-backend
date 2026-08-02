const {
  Queue,
  Registration,
  Patient,
  Doctor,
  Polyclinic,
  sequelize,
} = require("../models");
const { success } = require("../utils/response");
const ApiError = require("../utils/ApiError");

async function getAll(req, res, next) {
  try {
    const { date, status } = req.query;
    const where = {};
    if (date) where.queueDate = date;
    if (status) where.status = status;

    const include = [
      {
        model: Registration,
        as: "registration",
        include: [
          { model: Patient, as: "patient" },
          { model: Doctor, as: "doctor" },
          { model: Polyclinic, as: "polyclinic" },
        ],
      },
    ];

    // Kalau yang login adalah Dokter, filter hanya antrean untuk dirinya sendiri
    if (req.user.role === "Dokter") {
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (doctor) {
        include[0].where = { doctorId: doctor.id };
      }
    }

    const queues = await Queue.findAll({
      where,
      include,
      order: [["queueNumber", "ASC"]],
    });

    return success(res, queues);
  } catch (err) {
    next(err);
  }
}

async function callQueue(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const queue = await Queue.findByPk(req.params.id, {
      include: [
        {
          model: Registration,
          as: "registration",
          include: [
            { model: Patient, as: "patient" },
            { model: Doctor, as: "doctor" },
            { model: Polyclinic, as: "polyclinic" },
          ],
        },
      ],
      transaction: t,
    });

    if (!queue) throw new ApiError(404, "Antrean tidak ditemukan");

    if (queue.status !== "Menunggu") {
      throw new ApiError(422, "Validation Error", {
        status: `Antrean tidak bisa dipanggil karena statusnya sudah "${queue.status}"`,
      });
    }

    await queue.update(
      { status: "Dipanggil", calledAt: new Date() },
      { transaction: t },
    );

    // Sinkronisasi: begitu pasien dipanggil ke ruang periksa, status registration ikut berubah
    await queue.registration.update(
      { status: "Pemeriksaan" },
      { transaction: t },
    );

    await t.commit();

    return success(res, queue, "Antrean berhasil dipanggil");
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

async function updateStatus(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { status } = req.body;
    const validStatuses = ["Menunggu", "Dipanggil", "Selesai", "Dilewati"];

    if (!status || !validStatuses.includes(status)) {
      throw new ApiError(422, "Validation Error", {
        status: `Status harus salah satu dari: ${validStatuses.join(", ")}`,
      });
    }

    const queue = await Queue.findByPk(req.params.id, {
      include: [{ model: Registration, as: "registration" }],
      transaction: t,
    });
    if (!queue) throw new ApiError(404, "Antrean tidak ditemukan");

    await queue.update({ status }, { transaction: t });

    if (status === "Selesai") {
      await queue.registration.update(
        { status: "Selesai" },
        { transaction: t },
      );
    }

    await t.commit();
    return success(res, queue, "Status antrean berhasil diperbarui");
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

module.exports = { getAll, callQueue, updateStatus };
