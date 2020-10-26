const db = require('../utils/db.connection');
const Role = require('../utils/role');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

exports.createOrder = asyncHandler(async (req, res, next) => {
  req.body.customer = req.user.id;

  const order = await db.Order.create(req.body);

  res.status(201).json({
    success: true,
    data: order
  });

});

exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await db.Order.find({ customer: req.user.id }).populate('products.product');

  res.status(200).json({
    success: true,
    data: orders
  })
});

exports.getOrder = asyncHandler(async (req, res, next) => {

  const order = await db.Order.findById(req.params.id).populate('products.product');

  //check if user is owner of order
  if (order.customer != req.user.id) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  if (!order) {
    return next(new ErrorResponse('Order not found!', 404));
  }

  res.status(200).json({
    success: true,
    data: order
  });

});

exports.updateOrder = asyncHandler(async (req, res, next) => {

  const order = await db.Order.findById(req.params.id);

  //check if user is admin
  if (req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  if (!order) {
    return next(new ErrorResponse('Order not found!', 404));
  }

  Object.assign(order, req.body);
  order.updated = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

exports.deleteOrder = asyncHandler(async (req, res, next) => {

  //check if user is admin
  if (req.user.role !== Role.SuperAdmin && req.user.role !== Role.Admin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }
  
  const order = await db.Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order of id of ${req.params.id} not found`, 401));
  }

  await order.remove();

  res.status(200).json({
    succes: true,
    message: 'Order deleted successfully!'
  })
});