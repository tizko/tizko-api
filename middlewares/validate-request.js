const ErrorResponse = require('../utils/errorResponse');

const validateRequest = (req, next, schema) => {
  const options = {
    aborEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };

  const { error, value } = schema.validate(req.body, options);

  if(error) {
    const message = `Validation error: ${error.details.map(x => x.message).join(', ')}`;
    next(new ErrorResponse(message, 400));
  } else {
    req.body = value;
    next();
  }
}

module.exports = validateRequest;