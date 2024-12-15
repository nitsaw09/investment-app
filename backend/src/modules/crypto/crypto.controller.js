const asyncHandler = require('express-async-handler');
const CryptoService = require('./crypto.service');
const { validateGetHistoricalData, validateGetCryptoData, validateGetTopCoins } = require('./crypto.validation');

class CryptoController {
  getCryptoData = asyncHandler(async (req, res) => {
    const { symbol } = req.params;
    const validatedData = validateGetCryptoData({ symbol });
    const data = await CryptoService.getCryptoData(symbol);
    res.json(data);
  });

  getHistoricalData = asyncHandler(async (req, res) => {
    const { symbol } = req.params;
    const { limit } = req.query; 
    const validatedData = validateGetHistoricalData({ symbol, limit });
    const data = await CryptoService.getHistoricalData(symbol, limit);
    res.json(data);
  });

  getTopCoins = asyncHandler(async (req, res) => {
    const { limit } = req.query; 
    const validatedData = validateGetTopCoins({ limit });
    const data = await CryptoService.getTopCoins(limit);
    res.json(data);
  });
}

module.exports = new CryptoController();