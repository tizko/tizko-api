const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const validateRequest = require('../middlewares/validate-request');
const authorize = require('../middlewares/authorize');
const Role = require('../_helpers/role');
const productController = require('../controllers/productController');

//routes
router.post('/', authorize(), createProduct);
router.get('/all', authorize(), listProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', _deleteProduct);

module.exports = router;

function createSchema(req, res, next) {

}

function createProduct(req, res, next) {
  productController.create(req.body)
    .then((product) => {
      res.status(201).json(product)
    })
    .catch(next)
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
  console.log(req.params.id)
  productController
    .getById(req.params.id)
    .then((product) => (product ? res.json(product) : res.sendStatus(404)))
    .catch(next);
}

function updateProduct(req, res, next) {}

function _deleteProduct(req, res, next) {}
