const express = require('express');
const registrationController = require('../controllers/registrationController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', registrationController.getAll);
router.post('/', authorize('Administrator', 'Petugas Pendaftaran'), registrationController.create);
router.put('/:id', authorize('Administrator', 'Petugas Pendaftaran', 'Dokter'), registrationController.updateStatus);

module.exports = router;