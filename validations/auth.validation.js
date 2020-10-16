const Joi = require('@hapi/joi');
const validateRequest = require('../middlewares/validate-request');
const Role = require('../utils/role');

exports.authenticateSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  validateRequest(req, next, schema);
};

exports.revokeTokenSchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().empty(''),
  });
  validateRequest(req, next, schema);
};

exports.registerSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string()
      .min(8)
      .alphanum()
      .pattern(/^(?=.*[0-9].*[0-9])((?!password).)*$/), // regex ensures that password has atleast 2 numbers and does not contain the word 'password'
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().valid(Role.Admin, Role.Customer).empty('').required(),
    contactNumber: Joi.string()
      .pattern(/((^(\+)(\d){12}$)|(^\d{11}$))/) // regex validates ph mobile phone numbers (e.g +639123456789 or 09123456789)
      .required(),
    acceptTerms: Joi.boolean().required(),
  });

  validateRequest(req, next, schema);
};

exports.verifyEmailSchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required(),
  });

  validateRequest(req, next, schema);
}

exports.forgotPasswordSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  
  validateRequest(req, next, schema);
}

exports.resetPasswordSchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  });

  validateRequest(req, next, schema);
}
