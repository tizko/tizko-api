const db = require('../utils/db.connection');
const Role = require('../utils/role');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

exports.getProducts = asyncHandler(async (req, res, next) => {

  if (req.params.storeId) {
    //TO DO: add paginations IF listing products of a store
    const products = await db.Product.find({ store: req.params.storeId });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } else {
    res.status(200).json(res.advancedResults);
  }

});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await db.Product.findById(req.params.id).populate({
    path: 'store',
    select: 'name description'
  });

  if (!product) {
    return next(new ErrorResponse(`Product with id of ${req.params.id} is not found!`, 404));
  }

  res.status(200).json({
    success: true,
    data: product
  });

});

exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.store = req.params.storeId;

  const store = await db.Store.findById(req.params.storeId);

  //user with role of 'Admin' and 'SuperdAdmin' are allowed to update products
  if ((req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) || !(store.admins.includes(req.user.id))) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  // if (!(store.admins.includes(req.user.id))) {
  //   return next(new ErrorResponse('Unauthorized!', 401));
  // }
  // check if store exist
  if (!store) {
    return next(new ErrorResponse(`Store with ID of ${req.params.storeId} does not exist!`, 404));
  }

  // might have to refactor the validation
  if (await db.Product.findOne({ sku: req.body.sku })) {
    return next(new ErrorResponse(`Product with SKU of ${req.body.sku} already exist`, 400));
  }
  
  const product = new db.Product(req.body);

  await product.save();

  res.status(201).json({
    success: true,
    data: product
  })

});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  //user with role of 'Admin' and 'SuperdAdmin' are allowed to update products
  // TO DO: only admins of a store will be able to update a product
  if ((req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) || !(store.admins.includes(req.user.id))) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  const product = await db.Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product of id of ${req.params.id} not found`, 401));
  }

  Object.assign(product, req.body);
  product.updated = Date.now();

  await product.save();

  res.status(200).json({
    succes: true,
    data: basicDetails(product)
  });

});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  //user with role of 'Admin' and 'SuperdAdmin' are allowed to delete products
  // TO DO: only admins of a store will be able to update a product
  if ((req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) || !(store.admins.includes(req.user.id))) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  const product = await db.Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product of id of ${req.params.id} not found`, 401));
  }

  await product.remove();

  res.status(200).json({
    succes: true,
    message: 'Product deleted successfully!'
  })
});

//helper functions
function basicDetails(product) {
  const {
    id,
    sku,
    name,
    description,
    image,
    price,
    weight,
    category,
    store,
    created,
    updated,
    inStock,
  } = product;

  return {
    id,
    sku,
    name,
    description,
    image,
    price,
    weight,
    category,
    store,
    created,
    updated,
    inStock,
  };
}
