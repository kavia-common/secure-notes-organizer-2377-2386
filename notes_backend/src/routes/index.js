const express = require('express');
const healthController = require('../controllers/health');

const router = express.Router();
router.get('/', healthController.check.bind(healthController));

// Mount major feature routes
router.use('/auth', require('./auth'));
router.use('/notes', require('./notes'));

module.exports = router;
