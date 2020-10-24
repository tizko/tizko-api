const db = require('../utils/db.connection');
const Role = require('../utils/role');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

exports.getStores = asyncHandler(async (req, res, next) => {
  //user with role of 'SuperdAdmin' are allowed to list all stores
  if (req.user.role !== Role.SuperAdmin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  res.status(200).json(res.advancedResults);

  // res.status(200).json({
  //   success: true,
  //   count: stores.length,
  //   data: stores,
  // });
});

exports.getStore = asyncHandler(async (req, res, next) => {
  //user with role of 'Admin' and 'SuperAdmin' can get store details
  //TO DO: check if the user is a admin of store
  if (req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  const store = await db.Store.findById(req.params.id).populate('products');

  if (!store) {
    return next(
      new ErrorResponse(`Store with ID of ${req.params.id} is not found!`, 404)
    );
  }

  // res.status(200).json(res.advancedResults);
  res.status(200).json({
    success: true,
    data: store,
  });
});

exports.getStoreCustomers = asyncHandler(async (req, res, next) => {
  //user with role of 'Admin' and 'SuperAdmin' can get store details
  //TO DO: check if the user is a admin of store
  if (req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  const store = await db.Store.findById(req.params.storeId).where('admins').in(req.params.userId).populate('customers').exec();

  if (!store) {
    return next(
      new ErrorResponse(`Store or User Id is invalid!`, 404)
    );
  }

  // res.status(200).json(res.advancedResults);
  res.status(200).json({
    success: true,
    data: store,
  });
});

exports.createStore = asyncHandler(async (req, res, next) => {
  // only SuperAdmins can create a store
  if (req.user.role !== Role.SuperAdmin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }
  
  // check if the store already exist before creation
  if (await db.Store.findOne({ name: req.body.name })) {
    return next(new ErrorResponse(`Store with the name of ${req.body.name} already exist`, 400));
  }

  const store = new db.Store(req.body);

  await store.save();

  res.status(201).json({
    success: true,
    data: store
  })
})

exports.updateStore = asyncHandler(async (req, res, next) => {
  // user with the role of 'Admin' and 'SuperAdmin can update a store
  // TODO: check if the user is a admin of store
  if (req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  const store = await db.Store.findById(req.params.id);

  // might have to refactor the validation
  if (!store) {
    return next(new ErrorResponse(`Store with ID of ${req.params.id} is not found!`, 404));
  }

  Object.assign(store, req.body);
  store.updated = Date.now();

  await store.save();

  res.status(200).json({
    success: true,
    data: basicDetails(store)
  });

});

exports.deleteStore = asyncHandler(async (req, res, next) => {
  // only SuperAdmins can delete store
  if (req.user.role !== Role.SuperAdmin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  const store = await db.Store.findById(req.params.id);

  if (!store) {
    return next(new ErrorResponse(`Store with id of ${req.params.id} does not exist`, 400));
  }

  await store.remove();

  res.status(200).json({
    success: true,
    message: 'Store deleted successfully'
  });
});

//helper functions
const basicDetails = (store) => {
  const { id, name, description, image, location, contactNumber } = store;

  return { id, name, description, image, location, contactNumber };
}
