const express = require('express');
const doctorController = require('../controllers/doctorController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', doctorController.getAll);
router.post('/', authorize('Administrator'), doctorController.create);

module.exports = router;