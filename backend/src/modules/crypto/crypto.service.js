const axios = require('axios');
const { InternalServerError } = require('../../utils/errors');

axios.defaults.baseURL = 'https://min-api.cryptocompare.com/';

let response;

class CryptoService {
  constructor() {
    this.CRYPTO_API_KEY = process.env.CRYPTO_API_KEY;
  }

  async getHistoricalData(symbol, limit) {
    try {
      const response = await axios.get(`data/v2/histoday`, {
        params: {
          fsym: symbol,
          tsym: 'USD',
          limit: limit || 100
        },
        headers: {
          Authorization: `Apikey ${this.CRYPTO_API_KEY}`
        }
      });

      return response.data.Data;
    } catch (error) {
      throw new InternalServerError(`Error fetching historical cryptocurrency data: ${error.message}`);
    }
  }

  async getTopCoins(limit) {
    try {
      response = await axios.get(`data/top/mktcapfull`, {
        params: {
          limit: limit || 10,
          tsym: 'USD'
        },
        headers: {
          Authorization: `Apikey ${this.CRYPTO_API_KEY}`
        }
      });

      return response?.data?.Data;
    } catch (error) {
      throw new InternalServerError(`Error fetching top cryptocurrencies: ${error.message}`);
    }
  }
}

module.exports = new CryptoService();