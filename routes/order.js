const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const db = require('../utils/db.connection');
const { createOrder, getOrders, getOrder, updateOrder, deleteOrder } = require('../controllers/order');

router.route('/')
  .get(authorize(), getOrders)
  .post(authorize(), createOrder);

router.route('/:id')
  .get(authorize(), getOrder)
  .put(authorize(), updateOrder)
  .delete(authorize(), deleteOrder);

module.exports = router;