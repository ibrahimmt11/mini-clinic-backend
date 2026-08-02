const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('Dokter'), prescriptionController.create);
router.get('/:id', prescriptionController.getById);

module.exports = router;