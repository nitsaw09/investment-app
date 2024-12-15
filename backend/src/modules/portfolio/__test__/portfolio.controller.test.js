const PortfolioController = require('../portfolio.controller');
const PortfolioService = require('../portfolio.service');

jest.mock('../portfolio.service', () => ({
  createOrUpdatePortfolio: jest.fn(),
  getPortfolioValue: jest.fn(),
}));

describe('PortfolioController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      user: { id: 'user-id' },
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrUpdatePortfolio', () => {
    it('should create or update portfolio successfully', async () => {
      req.params.walletAddress = '0x0000000000000000000000000000000000000000';
      const mockPortfolio = { 
        id: 'portfolio-id', 
        userId: 'user-id', 
        walletAddress: '0x0000000000000000000000000000000000000000' 
      };

      PortfolioService.createOrUpdatePortfolio.mockResolvedValue(mockPortfolio);
      await PortfolioController.createOrUpdatePortfolio(req, res);
      expect(PortfolioService.createOrUpdatePortfolio).toHaveBeenCalledWith(
        req.user.id,
        req.params.walletAddress
      );
      expect(res.json).toHaveBeenCalledWith(mockPortfolio);
    });

    it('should handle validation error during create/update portfolio', async () => {
      req.params.walletAddress = '';
      
      await expect(PortfolioController.createOrUpdatePortfolio(req, res))
        .rejects
        .toThrow('walletAddress is not allowed to be empty');
    });
  });

  describe('getPortfolioValue', () => {
    it('should get portfolio value successfully', async () => {
      req.params.walletAddress = '0x0000000000000000000000000000000000000000';
      req.query = {
        page: 1,
        limit: 10,
        networkFilter: 'ethereum',
        nativeFilter: 'true'
      };

      const mockPortfolioValue = {
        totalValue: '1000',
        tokens: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 100
        }
      };

      PortfolioService.getPortfolioValue.mockResolvedValue(mockPortfolioValue);

      await PortfolioController.getPortfolioValue(req, res);

      expect(PortfolioService.getPortfolioValue).toHaveBeenCalledWith({
        walletAddress: req.params.walletAddress,
        ...req.query
      });
      expect(res.json).toHaveBeenCalledWith(mockPortfolioValue);
    });

    it('should handle validation error during get portfolio value', async () => {
      req.params.walletAddress = '0x0000000000000000000000000000000000000000';
      req.query = {
        page: 'invalid',
        limit: 'invalid'
      };

      await expect(PortfolioController.getPortfolioValue(req, res))
        .rejects
        .toThrow('page must be a number');
    });
  });
});
