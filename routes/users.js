const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const validateRequest = require('../middlewares/validate-request');
const authorize = require('../middlewares/authorize');
const Role = require('../utils/role');
const userController = require('../controllers/user');

//routes
router.post('/', authorize(Role.SuperAdmin), createSchema, create); // create user route for SuperAdmins
router.get('/', authorize(Role.SuperAdmin), getAll); // indexing all user accounts is only authorized for SuperAdmin users
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

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
    acceptTerms: Joi.boolean().required(),
  });

  validateRequest(req, next, schema);
}

function create(req, res, next) {
  userController
    .create(req.body)
    .then((user) => {
      res.status(201).json({
        success: true,
        data: user,
      });
    })
    .catch(next);
}

function getAll(req, res, next) {
  userController
    .getAll()
    .then((users) =>
      res.json({
        success: true,
        count: users.length,
        data: users,
      })
    )
    .catch(next);
}

function getById(req, res, next) {
  //users can get their own account and SuperAdmins can get any account
  if (req.params.id !== req.user.id && req.user.role !== Role.SuperAdmin) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  userController
    .getById(req.params.id)
    .then((user) =>
      user ? res.json({ success: true, data: user }) : res.sendStatus(404)
    )
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
    .then((user) => res.json({ success: true, data: user }))
    .catch(next);
}

function _delete(req, res, next) {
  //users can delete their own account and super admins can delete any account
  if (req.params.id !== req.user.id && req.user.role !== Role.SuperAdmin) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  userController
    .delete(req.params.id)
    .then(() => res.json({ sucess: true, message: 'Account deleted successfully!' }))
    .catch(next);
}
