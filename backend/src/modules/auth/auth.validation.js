const Joi = require('joi');
const { ValidationError } = require('../../utils/errors');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/

const signupSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(10)
    .pattern(passwordRegex)
    .messages({
      'string.pattern.base': 'Password must include an uppercase, lowercase, number, and special character.'
    }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({ 'any.only': 'Confirm password must match password' })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().min(10),
  newPassword: Joi.string().required().min(10)
    .pattern(passwordRegex)
    .messages({
      'string.pattern.base': 'Password must include an uppercase, lowercase, number, and special character.'
    }),
  confirmNewPassword: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
    .messages({ 'any.only': 'Confirm password must match new password' })
});

const validateSignup = (data) => {
  const { error, value } = signupSchema.validate(data);
  if (error) {
    throw new ValidationError(error.details[0].message.replace(/"/g, ''));
  }
  return value;
};

const validateLogin = (data) => {
  const { error, value } = loginSchema.validate(data);
  if (error) {
    throw new ValidationError(error.details[0].message.replace(/"/g, ''));
  }
  return value;
};

const validateChangePassword = (data) => {
  const { error, value } = changePasswordSchema.validate(data);
  if (error) {
    throw new ValidationError(error.details[0].message.replace(/"/g, ''));
  }
  return value;
};

module.exports = {
  validateSignup,
  validateLogin,
  validateChangePassword
};