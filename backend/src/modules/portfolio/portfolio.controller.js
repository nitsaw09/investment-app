const asyncHandler = require('express-async-handler');
const PortfolioService = require('./portfolio.service');
const { validateCreateOrUpdatePortfolio, validateGetPortfolioValue } = require('./portfolio.validation');

class PortfolioController {
  createOrUpdatePortfolio = asyncHandler(async (req, res) => {
    const { walletAddress } = req.params;
    const validatedData = validateCreateOrUpdatePortfolio({ walletAddress });
    const portfolio = await PortfolioService.createOrUpdatePortfolio(req.user.id, walletAddress);
    res.status(200).json(portfolio);
  });

  getPortfolioValue = asyncHandler(async (req, res) => {
    const { walletAddress } = req.params;
    const { page, limit, networkFilter, nativeFilter } = req.query;
    const validatedData = validateGetPortfolioValue({ walletAddress, page, limit, networkFilter, nativeFilter });
    const portfolioValue = await PortfolioService.getPortfolioValue(validatedData);
    res.status(200).json(portfolioValue);
  });
}

module.exports = new PortfolioController();