const { default: Moralis } = require('moralis');
const Portfolio = require('../portfolio.model');
const PortfolioService = require('../portfolio.service');
const { InternalServerError } = require('../../../utils/errors');
const chains = require('../../../utils/chains');

jest.mock('moralis', () => ({
  default: {
    start: jest.fn(),
    EvmApi: {
      wallets: {
        getWalletTokenBalancesPrice: jest.fn()
      }
    }
  }
}));

jest.mock('../portfolio.model', () => ({
  findOneAndUpdate: jest.fn(),
  aggregate: jest.fn()
}));

describe('PortfolioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MORALIS_API_KEY = 'test-api-key';
  });

  describe('initializeMoralis', () => {
    it('should initialize Moralis successfully', async () => {
      Moralis.start.mockResolvedValue();
      
      await PortfolioService.initializeMoralis();
      
      expect(Moralis.start).toHaveBeenCalledWith({
        apiKey: 'test-api-key'
      });
    });

    it('should throw InternalServerError when Moralis initialization fails', async () => {
      Moralis.start.mockRejectedValue(new Error('Moralis error'));
      
      await expect(PortfolioService.initializeMoralis())
        .rejects
        .toThrow(InternalServerError);
    });
  });

  describe('fetchPortfolioFromMoralis', () => {
    const mockWalletAddress = '0x123';
    const mockTokenData = {
      result: [
        { name: 'Token1', symbol: 'TK1', balanceFormatted: '100', usdValue: '1000' }
      ]
    };

    it('should fetch portfolio data from all chains', async () => {
      Moralis.EvmApi.wallets.getWalletTokenBalancesPrice.mockResolvedValue(mockTokenData);

      const result = await PortfolioService.fetchPortfolioFromMoralis(mockWalletAddress);

      expect(Moralis.EvmApi.wallets.getWalletTokenBalancesPrice)
        .toHaveBeenCalledTimes(Object.keys(chains).length);
      
      // Verify the call parameters for each chain
      Object.entries(chains).forEach(([_, { chainId }]) => {
        expect(Moralis.EvmApi.wallets.getWalletTokenBalancesPrice)
          .toHaveBeenCalledWith({
            address: mockWalletAddress,
            chain: chainId,
            limit: 20,
            excludeSpam: true
          });
      });

      expect(result).toHaveLength(Object.keys(chains).length);
    });

    it('should handle errors for individual chains', async () => {
      Moralis.EvmApi.wallets.getWalletTokenBalancesPrice
        .mockRejectedValueOnce(new Error('Chain error'))
        .mockResolvedValue(mockTokenData);

      const result = await PortfolioService.fetchPortfolioFromMoralis(mockWalletAddress);
      
      expect(result.length).toBeLessThan(Object.keys(chains).length);
    });

    it('should return empty object on complete failure', async () => {
      Moralis.EvmApi.wallets.getWalletTokenBalancesPrice
        .mockRejectedValue(new Error('Fatal error'));

      await expect(await PortfolioService.fetchPortfolioFromMoralis(mockWalletAddress)).toEqual([]);
    });
  });

  describe('createOrUpdatePortfolio', () => {
    const mockUserId = 'user123';
    const mockWalletAddress = '0x123';
    const mockMoralisData = [
      {
        name: 'Token1',
        chainName: 'ethereum',
        symbol: 'TK1',
        balanceFormatted: '100',
        nativeToken: true,
        usdValue: '1000',
        thumbnail: 'image.jpg'
      }
    ];

    it('should create or update portfolio successfully', async () => {
      const mockPortfolio = {
        userId: mockUserId,
        walletAddress: mockWalletAddress,
        tokenBalances: [
          {
            name: 'Token1',
            network: 'ETHEREUM',
            symbol: 'TK1',
            tokenBalance: '100',
            nativeToken: true,
            balanceUSD: '1000',
            imgUrl: 'image.jpg'
          }
        ]
      };

      jest.spyOn(PortfolioService, 'fetchPortfolioFromMoralis')
        .mockResolvedValue(mockMoralisData);
      Portfolio.findOneAndUpdate.mockResolvedValue(mockPortfolio);

      const result = await PortfolioService.createOrUpdatePortfolio(
        mockUserId,
        mockWalletAddress
      );

      expect(Portfolio.findOneAndUpdate).toHaveBeenCalledWith(
        { walletAddress: mockWalletAddress },
        expect.any(Object),
        { new: true, upsert: true }
      );
      expect(result).toEqual(mockPortfolio);
    });
  });

  describe('getPortfolioValue', () => {
    const mockWalletAddress = '0x123';
    const mockAggregateResult = [{
      totalBalanceUSD: 1000,
      tokenBalances: [
        {
          name: 'Token1',
          network: 'ETHEREUM',
          symbol: 'TK1',
          balanceUSD: '1000'
        }
      ],
      tokenCounts: 1
    }];

    it('should get portfolio value with default parameters', async () => {
      Portfolio.aggregate.mockResolvedValue(mockAggregateResult);

      const result = await PortfolioService.getPortfolioValue({
        walletAddress: mockWalletAddress
      });

      expect(Portfolio.aggregate).toHaveBeenCalled();
      expect(result).toEqual({
        totalValue: 1000,
        tokenCounts: 1,
        holdingsValue: {
          tokenBalances: mockAggregateResult[0].tokenBalances
        }
      });
    });

    it('should apply network and native token filters', async () => {
      Portfolio.aggregate.mockResolvedValue(mockAggregateResult);

      await PortfolioService.getPortfolioValue({
        walletAddress: mockWalletAddress,
        networkFilter: 'ethereum',
        nativeFilter: 'native'
      });

      expect(Portfolio.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          { $match: { walletAddress: mockWalletAddress } }
        ])
      );
    });

    it('should handle empty result', async () => {
      Portfolio.aggregate.mockResolvedValue([]);

      const result = await PortfolioService.getPortfolioValue({
        walletAddress: mockWalletAddress
      });

      expect(result).toEqual({});
    });
  });
});