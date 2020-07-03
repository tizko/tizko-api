const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const validateRequest = require('../_middlewares/validate-request');
const authorize = require('../_middlewares/authorize');
const Role = require('../_helpers/role');
const userController = require('../controllers/userController');

//routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/register', registerSchema, register);
router.post('/verify-email', verifyEmailSchema, verifyEmail);
router.post('/', authorize(Role.SuperAdmin), createSchema, create); // create user route for SuperAdmins
router.get('/', authorize(Role.SuperAdmin), getAll); // indexing all user accounts is only authorized for SuperAdmin users
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
  const { email, password } = req.body;
  const ipAddress = req.ip;

  userController
    .authenticate({ email, password, ipAddress })
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      res.json(user);
    })
    .catch(next);
}

function refreshToken(req, res, next) {
  const token = req.cookies.refreshToken;
  const ipAddress = req.ip;

  userController
    .refreshToken({ token, ipAddress })
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      res.json(user);
    })
    .catch(next);
}

function registerSchema(req, res, next) {
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
}

function register(req, res, next) {
  userController
    .register(req.body, req.get('origin'))
    .then(() => {
      res.status(201).json({
        message:
          'Registration Succesful, please check your email for Verification instructions.',
      });
    })
    .catch(next);
}

function verifyEmailSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().required(),
  });

  validateRequest(req, next, schema);
}

function verifyEmail(req, res, next) {
  userController
    .verifyEmail(req.body)
    .then(() =>
      res.json({ message: 'Verification successful, you can now Login.' })
    )
    .catch(next);
}

function createSchema(req, res, next) {
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
  });

  validateRequest(req, next, schema);
}

function create(req, res, next) {
  userController
    .create(req.body)
    .then((token) => {
      res.status(201).json(token);
    })
    .catch(next);
}

function getAll(req, res, next) {
  userController
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getById(req, res, next) {
  //users can get their own account and SuperAdmins can get any account
  if (req.params.id !== req.user.id && req.user.role !== Role.SuperAdmin) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  userController
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch(next);
}

function updateSchema(req, res, next) {
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

function update(req, res, next) {
  //users can update their own account and super admins can update any account
  if (req.params.id !== req.user.id && req.user.role !== Role.SuperAdmin) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  userController
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function _delete(req, res, next) {
  //users can update their own account and super admins can delete any account
  if (req.params.id !== req.user.id && req.user.role !== Role.SuperAdmin) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  userController
    .delete(req.params.id)
    .then(() => res.json({ message: 'Account deleted successfully!' }))
    .catch(next);
}

//helper functions

function setTokenCookie(res, token) {
  //create cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 + 24 * 60 * 60 * 1000),
  };

  res.cookie('refreshToken', token, cookieOptions);
}
