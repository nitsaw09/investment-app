const Joi = require('joi');
const { ValidationError } = require('../../utils/errors');

const createOrUpdatePortfolioSchema = Joi.object({
  walletAddress: Joi.string().required().min(42)
});

const getPortfolioValueSchema = Joi.object({
  page: Joi.number(),
  limit: Joi.number().min(1),  
  walletAddress: Joi.string().required().min(42),
  networkFilter: Joi.string(),
  nativeFilter: Joi.string()
});

const validateCreateOrUpdatePortfolio = (data) => {
    const { error, value } = createOrUpdatePortfolioSchema.validate(data);
    if (error) {
      throw new ValidationError(error.details[0].message.replace(/"/g, ''));
    }
    return value;
};

const validateGetPortfolioValue = (data) => {
  const { error, value } = getPortfolioValueSchema.validate(data);
  if (error) {
    throw new ValidationError(error.details[0].message.replace(/"/g, ''));
  }
  return value;
};

module.exports = {
  validateCreateOrUpdatePortfolio,
  validateGetPortfolioValue
};