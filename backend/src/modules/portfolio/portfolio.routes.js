const express = require('express');
const PortfolioController = require('./portfolio.controller');
const { authHandler } = require('../../middleware/auth.middleware');

const router = express.Router();

router.put('/:walletAddress/update', authHandler, PortfolioController.createOrUpdatePortfolio);
router.get('/:walletAddress/value', authHandler, PortfolioController.getPortfolioValue);

module.exports = router;