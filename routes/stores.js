const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const Role = require('../utils/role');
const { createSchema, updateSchema } = require('../validations/store.validation');
const { getStores, getStore, updateStore, createStore, deleteStore } = require('../controllers/store');

//include other resource routers
const productRouter = require('../routes/products');

//re-route into other resource routers
router.use('/:storeId/products', productRouter);

//routes
router.route('/')
  .get(authorize(Role.SuperAdmin), getStores)
  .post(authorize(Role.SuperAdmin), createSchema, createStore);
router.route('/:id')
  .get(authorize(), getStore)
  .put(authorize(Role.SuperAdmin, Role.Admin), updateSchema, updateStore)
  .delete(authorize(Role.SuperAdmin), deleteStore);

module.exports = router;