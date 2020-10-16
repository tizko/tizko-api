const express = require('express');
const router = express.Router({ mergeParams: true });
const authorize = require('../middlewares/authorize');
const db = require('../utils/db.connection');
const advancedResults = require('../middlewares/advancedResults');
const { createSchema, updateSchema } = require('../validations/product.validation');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getAll } = require('../controllers/product');

const Product = db.Product;

//routes
router.route('/')
  .get(authorize(), advancedResults(Product, { path: 'store', select: 'name description' }), getProducts)
  .post(authorize(), createSchema, createProduct);
router.route('/:id')
  .get(authorize(), getProduct)
  .put(authorize(), updateSchema, updateProduct)
  .delete(authorize(), deleteProduct);

module.exports = router;
