const express = require('express');
const medicalRecordController = require('../controllers/medicalRecordController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('Dokter'), medicalRecordController.create);
router.get('/:patientId', medicalRecordController.getByPatient);

module.exports = router;