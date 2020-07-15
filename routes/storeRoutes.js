const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const validateRequest = require('../middlewares/validate-request');
const authorize = require('../middlewares/authorize');
const Role = require('../_helpers/role');
const storeController = require('../controllers/storeController');

//routes
router.get('/', authorize(), getStores);
router.get('/:id', authorize(), getStore);
router.post('/', authorize(Role.SuperAdmin), createSchema, createStore);
router.put('/:id', authorize(), updateSchema, updateStore);
router.delete('/:id', authorize(), _deleteStore);

module.exports = router;

function getStores(req, res, next) {
  storeController
    .getAll()
    .then((stores) => res.json(stores))
    .catch(next);
}

function getStore(req, res, next) {
  storeController
    .getById(req.params.id)
    .then((store) => (store ? res.json(store) : res.sendStatus(404)))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    location: Joi.string().required()
  });

  validateRequest(req, next, schema);
}

function createStore(req, res, next) {
  storeController
    .create(req.body)
    .then((store) => res.status(201).json(store))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().empty(''),
    description: Joi.string().empty(''),
    image: Joi.string().empty(''),
    location: Joi.string().empty('')
  });

  validateRequest(req, next, schema);
}

function updateStore(req, res, next) {
  //user with role of 'Admin' and 'SuperdAdmin' are allowed to update products
  if (req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) {
    throw res.status(401).json({ message: 'Unauthorized!' });
  }

  storeController
    .update(req.params.id, req.body)
    .then((store) => res.json(store))
    .catch(next);
}

function _deleteStore(req, res, next) {
  if (req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) {
    throw res.status(401).json({ message: 'Unauthorized!' });
  }

  storeController
    .delete(req.params.id)
    .then(() => res.json({ message: 'Store deleted successfully!' }))
    .catch(next);
}
