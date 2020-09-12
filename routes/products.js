const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const validateRequest = require('../middlewares/validate-request');
const authorize = require('../middlewares/authorize');
const Role = require('../utils/role');
const productController = require('../controllers/product');

//routes
router.post('/', authorize(), createSchema, createProduct);
router.get('/all', authorize(), listProducts);
router.get('/:id', authorize(), getProduct);
router.put('/:id', authorize(), updateSchema, updateProduct);
router.delete('/:id', authorize(), _deleteProduct);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    sku: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    weight: Joi.number().required(),
    category: Joi.string().required(),
    stock: Joi.number().required(),
  });

  validateRequest(req, next, schema);
}

function createProduct(req, res, next) {
  productController
    .create(req.body)
    .then((product) => {
      res.status(201).json(product);
    })
    .catch(next);
}

function listProducts(req, res, next) {
  productController
    .getAll()
    .then((products) => {
      res.json(products);
    })
    .catch(next);
}

function getProduct(req, res, next) {
  productController
    .getById(req.params.id)
    .then((product) => (product ? res.json(product) : res.sendStatus(404)))
    .catch(next);
}

function updateSchema(req, res, next) {
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

function updateProduct(req, res, next) {
  //user with role of 'Admin' and 'SuperdAdmin' are allowed to update products
  if (req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) {
    throw res.status(401).json({ message: 'Unauthorized!' });
  }

  productController
    .update(req.params.id, req.body)
    .then((product) => {
      res.json(product);
    })
    .catch(next);
}

function _deleteProduct(req, res, next) {
  //user with role of 'Admin' and 'SuperAdmin' are allowed to delete prducts
  if (req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) {
    throw res.status(401).json({ message: 'Unauthorized!' });
  }

  productController
    .delete(req.params.id)
    .then(() => res.json({ message: 'Product deleted successfully!' }))
    .catch(next);
}
