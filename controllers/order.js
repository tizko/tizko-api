const db = require('../utils/db.connection');
const Role = require('../utils/role');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

exports.getOrders = asyncHandler(async (req, res, next) => {
  //user with role of 'Admin' and 'SuperAdmin' can get store details
  //TO DO: check if the user is a admin of store
  if (req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  const orders = await db.Order.findById(req.params.id).populate('customer');

  if (req.params.id) {

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

exports.createProduct = asyncHandler(async (req, res, next) => {
    req.body.store = req.params.storeId;
  
    const store = await db.Store.findById(req.params.storeId);
    console.log(req.user.id);
    console.log(req.body);
  
    //user with role of 'Admin' and 'SuperdAdmin' are allowed to update products
    // TO DO: check if user is admin of store
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