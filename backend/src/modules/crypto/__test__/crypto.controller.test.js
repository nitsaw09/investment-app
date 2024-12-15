const CryptoController = require('../crypto.controller');
const CryptoService = require('../crypto.service');

jest.mock('../crypto.service', () => ({
  getCryptoData: jest.fn(),
  getHistoricalData: jest.fn(),
  getTopCoins: jest.fn(),
}));

describe('CryptoController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCryptoData', () => {
    it('should get crypto data successfully', async () => {
      req.params.symbol = 'BTC';
      const mockData = { USD: 50000 };

      CryptoService.getCryptoData.mockResolvedValue(mockData);

      await CryptoController.getCryptoData(req, res);

      expect(CryptoService.getCryptoData).toHaveBeenCalledWith(req.params.symbol);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle validation error during getCryptoData', async () => {
      req.params.symbol = '';

      await expect(CryptoController.getCryptoData(req, res))
        .rejects
        .toThrow("symbol is not allowed to be empty");
    });
  });

  describe('getHistoricalData', () => {
    it('should get historical data successfully', async () => {
      req.params.symbol = 'BTC';
      req.query.limit = '30';
      const mockData = [
        { time: 1633046400, close: 50000 },
        { time: 1633132800, close: 51000 },
      ];

      CryptoService.getHistoricalData.mockResolvedValue(mockData);

      await CryptoController.getHistoricalData(req, res);

      expect(CryptoService.getHistoricalData).toHaveBeenCalledWith(req.params.symbol, req.query.limit);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle validation error during getHistoricalData', async () => {
      req.params.symbol = '';
      req.query.limit = 10; 

      await expect(CryptoController.getHistoricalData(req, res))
        .rejects
        .toThrow("symbol is not allowed to be empty");
    });
  });

  describe('getTopCoins', () => {
    it('should get top coins successfully', async () => {
      req.query.limit = '10';
      const mockData = [
        { symbol: 'BTC', price: 50000 },
        { symbol: 'ETH', price: 3000 },
      ];

      CryptoService.getTopCoins.mockResolvedValue(mockData);

      await CryptoController.getTopCoins(req, res);

      expect(CryptoService.getTopCoins).toHaveBeenCalledWith(req.query.limit);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle validation error during getTopCoins', async () => {
      req.query.limit = 'invalid'; // Invalid limit

      await expect(CryptoController.getTopCoins(req, res))
        .rejects
        .toThrow("limit must be a number");
    });
  });
});
