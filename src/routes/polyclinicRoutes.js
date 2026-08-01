const express = require('express');
const polyclinicController = require('../controllers/polyclinicController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', polyclinicController.getAll);
router.post('/', authorize('Administrator'), polyclinicController.create);

module.exports = router;