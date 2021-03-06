const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const db = require('../utils/db.connection');
const Role = require('../utils/role');
const { createSchema, updateSchema } = require('../validations/store.validation');
const { getStores, getStore, getStoreCustomers, updateStore, createStore, deleteStore, searchStore } = require('../controllers/store');

const Store = db.Store;

const advancedResults = require('../middlewares/advancedResults');

//include other resource routers
const productRouter = require('../routes/products');
const userRouter = require('../routes/users');

//re-route into other resource routers
router.use('/:storeId/products', productRouter);
router.use('/:storeId/users', userRouter);

//routes
router.route('/')
  .get(authorize(Role.SuperAdmin), advancedResults(Store, 'products'), getStores)
  .post(authorize(Role.SuperAdmin), createSchema, createStore);

router.route('/:id')
  .get(authorize(), getStore)
  .put(authorize(Role.SuperAdmin, Role.Admin), updateSchema, updateStore)
  .delete(authorize(Role.SuperAdmin), deleteStore);

router.route('/:storeId/:userId/customers').get(authorize(), getStoreCustomers);
router.route('/search/:term').get(authorize(Role.SuperAdmin), searchStore);

module.exports = router;