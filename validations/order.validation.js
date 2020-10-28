const Joi = require('@hapi/joi');
const validateRequest = require('../middlewares/validate-request');

exports.createSchema = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().required(),
    fullfillmentStatus: Joi.string().required(),
    notes: Joi.string().required(),
    total: Joi.number().required(),
  });

  validateRequest(req, next, schema);
}
