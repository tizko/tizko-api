const Joi = require('@hapi/joi');
const validateRequest = require('../middlewares/validate-request');

exports.createSchema = (req, res, next) =>{
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    contactNumber: Joi.string().required()
  });

  validateRequest(req, next, schema);
}

exports.updateSchema = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().empty(''),
    description: Joi.string().empty(''),
    location: Joi.string().empty(''),
    contactNumber: Joi.string().empty('')
  });

  validateRequest(req, next, schema);
}