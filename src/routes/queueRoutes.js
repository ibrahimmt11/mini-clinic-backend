const express = require('express');
const queueController = require('../controllers/queueController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', queueController.getAll);
router.put('/:id/call', authorize('Administrator', 'Petugas Pendaftaran', 'Dokter'), queueController.callQueue);
router.put('/:id/status', authorize('Administrator', 'Petugas Pendaftaran', 'Dokter'), queueController.updateStatus);

module.exports = router;