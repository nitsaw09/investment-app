const axios = require('axios');
const CryptoService = require('../crypto.service'); // Adjust the path accordingly
const { BadRequestError } = require('../../../utils/errors');

jest.mock('axios');

describe('CryptoService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCryptoData', () => {
    it('should return crypto data for a valid symbol', async () => {
      const symbol = 'BTC';
      const mockData = { USD: 50000 };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await CryptoService.getCryptoData(symbol);
      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('/data/price', {
        params: { fsym: symbol, tsyms: 'USD' },
        headers: {
          Authorization: `Apikey Test`
        }
      });
    });

    it('should throw BadRequestError if no data is found', async () => {
      const symbol = 'BTC';
      axios.get.mockResolvedValue({ data: null });

      await expect(CryptoService.getCryptoData(symbol)).rejects.toThrow(BadRequestError);
      await expect(CryptoService.getCryptoData(symbol)).rejects.toThrow('No data found for the given cryptocurrency symbol');
    });

    it('should throw BadRequestError on axios error', async () => {
      const symbol = 'BTC';
      axios.get.mockRejectedValue(new BadRequestError('Network Error'));

      await expect(CryptoService.getCryptoData(symbol)).rejects.toThrow(BadRequestError);
      await expect(CryptoService.getCryptoData(symbol)).rejects.toThrow('Network Error');
    });
  });

  describe('getHistoricalData', () => {
    it('should return historical data for a valid symbol', async () => {
      const symbol = 'BTC';
      const limit = 10;
      const mockData = { Data: [{ time: 1633046400, close: 50000 }] };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await CryptoService.getHistoricalData(symbol, limit);
      expect(result).toEqual(mockData.Data);
      expect(axios.get).toHaveBeenCalledWith('data/v2/histoday', {
        params: { fsym: symbol, tsym: 'USD', limit },
        headers: {
          Authorization: `Apikey Test`
        }
      });
    });

    it('should throw BadRequestError if no historical data is found', async () => {
      const symbol = 'BTC';
      axios.get.mockResolvedValue({ data: {} });

      await expect(CryptoService.getHistoricalData(symbol)).rejects.toThrow(BadRequestError);
      await expect(CryptoService.getHistoricalData(symbol)).rejects.toThrow('No historical data found for the given cryptocurrency symbol');
    });

    it('should throw BadRequestError on axios error', async () => {
      const symbol = 'BTC';
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(CryptoService.getHistoricalData(symbol)).rejects.toThrow(Error);
      await expect(CryptoService.getHistoricalData(symbol)).rejects.toThrow('Network Error');
    });
  });

  describe('getTopCoins', () => {
    it('should return top coins data', async () => {
      const limit = 10;
      const mockData = { Data: [{ CoinName: 'Bitcoin', Price: 50000 }] };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await CryptoService.getTopCoins(limit);
      expect(result).toEqual(mockData.Data);
      expect(axios.get).toHaveBeenCalledWith('data/top/mktcapfull', {
        params: { limit, tsym: 'USD' },
        headers: {
          Authorization: `Apikey Test`
        }
      });
    });

    it('should throw BadRequestError if no top coins data is found', async () => {
      axios.get.mockResolvedValue({ data: {} });

      await expect(CryptoService.getTopCoins()).rejects.toThrow(BadRequestError);
      await expect(CryptoService.getTopCoins()).rejects.toThrow('No top coins data found');
    });

    it('should throw BadRequestError on axios error', async () => {
      const limit = 10;
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(CryptoService.getTopCoins(limit)).rejects.toThrow(BadRequestError);
      await expect(CryptoService.getTopCoins(limit)).rejects.toThrow('Error fetching top cryptocurrencies: Network Error');
    });
  });
});