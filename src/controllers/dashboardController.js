const { Op } = require("sequelize");
const { Patient, Registration, Queue, Doctor } = require("../models");
const { success } = require("../utils/response");

async function getSummary(req, res, next) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const startOfToday = new Date(`${today}T00:00:00.000Z`);
    const endOfToday = new Date(`${today}T23:59:59.999Z`);

    let doctorId = null;
    if (req.user.role === "Dokter") {
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      doctorId = doctor?.id || null;
    }

    const registrationWhereBase = doctorId ? { doctorId } : {};
    const queueWhereBase = {};

    const [
      totalPatients,
      totalPatientsToday,
      totalQueueToday,
      totalPatientsWaiting,
      totalPatientsDone,
    ] = await Promise.all([
      Patient.count(),

      Patient.count({
        where: { createdAt: { [Op.between]: [startOfToday, endOfToday] } },
      }),

      doctorId
        ? Queue.count({
            where: { queueDate: today, ...queueWhereBase },
            include: [
              {
                model: Registration,
                as: "registration",
                where: { doctorId },
                required: true,
              },
            ],
          })
        : Queue.count({ where: { queueDate: today } }),

      Registration.count({
        where: { status: "Menunggu", ...registrationWhereBase },
      }),

      Registration.count({
        where: {
          status: "Selesai",
          visitDate: today,
          ...registrationWhereBase,
        },
      }),
    ]);

    return success(res, {
      totalPatients,
      totalPatientsToday,
      totalQueueToday,
      totalPatientsWaiting,
      totalPatientsDone,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary };
