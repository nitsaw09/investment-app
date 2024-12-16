const express = require('express');
const cryptoController = require('./crypto.controller');
const { authHandler } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/historical/:symbol', authHandler, cryptoController.getHistoricalData);
router.get('/top-coins', authHandler, cryptoController.getTopCoins);

module.exports = router;