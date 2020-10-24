const Joi = require('@hapi/joi');
const validateRequest = require('../middlewares/validate-request');

exports.createSchema = (req, res, next) => {
  const schema = Joi.object({
    sku: Joi.string(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    weight: Joi.number(),
    category: Joi.string(),
    stock: Joi.number().required(),
  });

  validateRequest(req, next, schema);
}

exports.updateSchema = (req, res, next) => {
  const schema = Joi.object({
    sku: Joi.string().empty(''),
    name: Joi.string().empty(''),
    description: Joi.string().empty(''),
    price: Joi.number().empty(''),
    weight: Joi.number().empty(''),
    category: Joi.string().empty(''),
    stock: Joi.number().empty(''),
  });

  validateRequest(req, next, schema);
}
