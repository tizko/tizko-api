const db = require('../utils/db.connection');
const Role = require('../utils/role');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

exports.getAll = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = db.Product.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-updated');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await db.Product.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  const products = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  // if (req.params) {
  //   products = await db.Product.find();
  // } else {
  //   products = await db.Product.find();
  // }

  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products.map((x) => basicDetails(x))
  })
});

exports.getProducts = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.storeId) {
    query = await db.Product.find({ store: req.params.storeId });
  } else {
    query = await db.Product.find();
  }

  const products = await query;

  res.status(200).json({
    success: true,
    count: products.length,
    data: products.map((x) => basicDetails(x))
  });

});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await db.Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product with id of ${req.params.id} is not found!`, 404));
  }

  res.status(200).json({
    success: true,
    data: product
  })
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  // might have to refactor the validation
  // TO DO: only admins of a store will be able to create a product
  if (await db.Product.findOne({ sku: req.body.sku })) {
    return next(new ErrorResponse(`Product with SKU of ${req.body.sku} already exist`, 400));
  }

  const product = new db.Product(req.body);

  await product.save();

  res.status(201).json({
    success: true,
    data: basicDetails(product)
  })

});

exports.updateProduct = asyncHandler(async (req, res, next) => {

  //user with role of 'Admin' and 'SuperdAdmin' are allowed to update products
  if (req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) {
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
  if (req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) {
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
    created,
    updated,
    inStock,
  };
}
