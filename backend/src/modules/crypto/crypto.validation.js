const Joi = require('joi');
const { ValidationError } = require('../../utils/errors');

const getCryptoDataSchema = Joi.object({
  symbol: Joi.string().required().min(2).max(50)
});

const getHistoricalDataSchema = Joi.object({
    symbol: Joi.string().required().min(2).max(50),
    limit: Joi.number()
});

const getTopCoinsSchema = Joi.object({
    limit: Joi.number()
});

const validateGetCryptoData = (data) => {
    const { error, value } = getCryptoDataSchema.validate(data);
    if (error) {
      throw new ValidationError(error.details[0].message.replace(/"/g, ''));
    }
    return value;
};

const validateGetHistoricalData = (data) => {
  const { error, value } = getHistoricalDataSchema.validate(data);
  if (error) {
    throw new ValidationError(error.details[0].message.replace(/"/g, ''));
  }
  return value;
};

const validateGetTopCoins = (data) => {
  const { error, value } = getTopCoinsSchema.validate(data);
  if (error) {
    throw new ValidationError(error.details[0].message.replace(/"/g, ''));
  }
  return value;
};

module.exports = {
  validateGetCryptoData,
  validateGetHistoricalData,
  validateGetTopCoins
};