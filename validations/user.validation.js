const Joi = require('@hapi/joi');
const validateRequest = require('../middlewares/validate-request');
const Role = require('../utils/role');

exports.createSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string()
      .min(8)
      .alphanum()
      .pattern(/^(?=.*[0-9].*[0-9])((?!password).)*$/), // regex ensures that password has atleast 2 numbers and does not contain the word 'password'
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string()
      .valid(Role.SuperAdmin, Role.Admin, Role.Customer)
      .empty('')
      .required(),
    contactNumber: Joi.string()
      .pattern(/((^(\+)(\d){12}$)|(^\d{11}$))/) // regex validates ph mobile phone numbers (e.g +639123456789 or 09123456789)
      .required(),
    acceptTerms: Joi.boolean().required(),
  });

  validateRequest(req, next, schema);
}

exports.updateSchema = (req, res, next) => {
  const schemaRules = {
    email: Joi.string().email().empty(''),
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    password: Joi.string()
      .min(8)
      .alphanum()
      .pattern(/^(?=.*[0-9].*[0-9])((?!password).)*$/)
      .empty(''),
    confirmPassword: Joi.string().valid(Joi.ref('password')).empty(''),
    contactNumber: Joi.string()
      .pattern(/((^(\+)(\d){12}$)|(^\d{11}$))/)
      .empty(''), // regex validates ph mobile phone numbers (e.g +639123456789 or 09123456789)
    shippingAddress: Joi.string().empty(''),
    billingAddress: Joi.string().empty(''),
  };

  // only super admins can update role
  if (req.user.role === Role.SuperAdmin) {
    schemaRules.role = Joi.string().valid(Role.Admin, Role.Customer).empty('');
  }

  const schema = Joi.object(schemaRules).with('password', 'confirmPassword');

  validateRequest(req, next, schema);
}