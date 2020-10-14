const express = require('express');
const router = express.Router({ mergeParams: true });
const authorize = require('../middlewares/authorize');
const { createSchema, updateSchema } = require('../validations/product.validation');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getAll } = require('../controllers/product');

//routes
router.route('/')
  .get(authorize(), getProducts)
  .post(authorize(), createSchema, createProduct);
router.route('/:id')
  .get(authorize(), getProduct)
  .put(authorize(), updateSchema, updateProduct)
  .delete(authorize(), deleteProduct);

module.exports = router;
