const { default: Moralis } = require('moralis');
const { InternalServerError } = require('../../utils/errors');
const Portfolio = require('./portfolio.model');
const chains = require('../../utils/chains');

class PortfolioService {
  constructor() {
    this.initializeMoralis();
  }

  async initializeMoralis() {
    try {
      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY 
      });
    } catch (error) {
      throw new InternalServerError('Failed to initialize Moralis');
    }
  }

  async fetchPortfolioFromMoralis(walletAddress) {
    const walletTokens = await Promise.all(
      Object.entries(chains).map(async ([chainName, { chainId }]) => {
        try {
          const data = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
            address: walletAddress,
            chain: chainId,
            limit: 20,
            excludeSpam: true
          });
          return (data?.result || []).map(token => ({ ...token, chainName }));
        } catch (error) {
          return [];
        }
      })
    );

    return walletTokens.flat(); 
  }

  async createOrUpdatePortfolio(userId, walletAddress) {
    const moralisPortfolio = await this.fetchPortfolioFromMoralis(walletAddress);
    
    const tokenBalances = moralisPortfolio.map(token => ({
      name: token?.name, 
      network: token?.chainName.toUpperCase(),
      symbol: token?.symbol, 
      tokenBalance: token?.balanceFormatted,
      nativeToken: token?.nativeToken,
      balanceUSD: token?.usdValue,
      imgUrl: token?.thumbnail || ''
    }));

    const portfolio = await Portfolio.findOneAndUpdate(
      { walletAddress },
      { userId, tokenBalances },
      { new: true, upsert: true }
    );

    return portfolio;
  }

  async getPortfolioValue({ 
    walletAddress, 
    page = 0, 
    limit = 3,
    networkFilter = "all",
    nativeFilter = "all" 
  }) {
    const skip = page * limit; 

    const $tokenBalancesAnd = [];

    if (networkFilter !== "all") {
      $tokenBalancesAnd.push({ $eq: ["$$token.network", networkFilter.toUpperCase()] });
    }
  
    if (nativeFilter !== "all") {
      $tokenBalancesAnd.push({ $eq: ["$$token.nativeToken", nativeFilter === "native"] });
    }

    const $filterTokenBalances = {
      $filter: {
        input: "$tokenBalances", 
        as: "token", 
        cond: { 
          $and: $tokenBalancesAnd
        }
      }
    };

    const result = await Portfolio.aggregate([
      { 
        $match: { walletAddress } 
      },
      {
        $project: {
          totalBalanceUSD: {
            $sum: "$tokenBalances.balanceUSD" 
          },
          tokenBalances: {
            $slice: [
              $filterTokenBalances,
              skip, 
              limit
            ]
          },
          tokenCounts: {
            $size: $filterTokenBalances
          }
        }
      }
    ]);
    
  
    if (result.length === 0) {
      return {};
    }
  
    const { totalBalanceUSD, tokenBalances, tokenCounts } = result[0];
  
    return {
      totalValue: totalBalanceUSD,
      tokenCounts,
      holdingsValue: {
        tokenBalances
      }
    };
  }
}

module.exports = new PortfolioService();