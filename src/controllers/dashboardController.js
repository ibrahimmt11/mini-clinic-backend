const { Op } = require('sequelize');
const { Patient, Registration, Queue } = require('../models');
const { success } = require('../utils/response');

async function getSummary(req, res, next) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const startOfToday = new Date(`${today}T00:00:00.000Z`);
    const endOfToday = new Date(`${today}T23:59:59.999Z`);

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
      Queue.count({ where: { queueDate: today } }),
      Registration.count({ where: { status: 'Menunggu' } }),
      Registration.count({
        where: { status: 'Selesai', visitDate: today },
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