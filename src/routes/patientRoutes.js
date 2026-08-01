const express = require('express');
const patientController = require('../controllers/patientController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', patientController.getAll);
router.get('/:id', patientController.getById);
router.post('/', authorize('Administrator', 'Petugas Pendaftaran'), patientController.create);
router.put('/:id', authorize('Administrator', 'Petugas Pendaftaran'), patientController.update);
router.delete('/:id', authorize('Administrator'), patientController.remove);

module.exports = router;