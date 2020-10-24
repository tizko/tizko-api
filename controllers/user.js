const db = require('../utils/db.connection');
const bcrypt = require('bcryptjs');
const Role = require('../utils/role');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

exports.getCurrent = asyncHandler(async (req, res, next) => {

  const user = await db.User.findById(req.user.id).populate('store');

  if (!user) {
    return next(new ErrorResponse('User not found!', 404));
  }

  res.status(200).json({
    success: true,
    data: basicDetails(user)
  });

});

exports.createUser = asyncHandler(async (req, res, next) => {
  // only user with the role of SuperAdmin can create users
  if (req.user.role !== Role.SuperAdmin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  //TO DO:
  //sends an email to newly created user
  //email contains random password with instructions to update password

  //check if user already exists
  if (await db.User.findOne({ email: req.body.email })) {
    return next(new ErrorResponse('User already exist!'));
  }

  const user = new db.User(req.body);
  user.verified = Date.now();

  user.passwordHash = hash(req.body.password);

  await user.save();

  res.status(201).json({
    success: true,
    data: basicDetails(user)
  });

});

exports.getUsers = asyncHandler(async (req, res, next) => {
  // only user with role of SuperAdmin can list all users
  if (req.user.role !== Role.SuperAdmin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  res.status(200).json(res.advancedResults);

  // const users = await db.User.find();

  // res.status(200).json({
  //   success: true,
  //   count: users.length,
  //   data: users.map((x) => basicDetails(x))
  // });

});

exports.getUser = asyncHandler(async (req, res, next) => {
  //TO DO: check if what store is the user admin to
  //users can get their own account and SuperAdmins can get any account
  if (req.params.id !== req.user.id && req.user.role !== Role.SuperAdmin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  const user = await db.User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found!', 404));
  }

  res.status(200).json({
    success: true,
    data: basicDetails(user)
  });

});

exports.updateUser = asyncHandler(async (req, res, next) => {
  //users can update their own account and super admins can update any account
  if (req.params.id !== req.user.id && req.user.role !== Role.SuperAdmin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  const user = await db.User.findById(req.params.id);

  //validated
  if (
    user.email !== req.body.email &&
    (await db.User.findOne({ email: req.body.email }))
  ) {
    return next(new ErrorResponse(`Email ${req.body.email} is already taken!`, 400));
  }

  //hash password if it was entered
  if (req.body.password) {
    req.body.passwordHash = hash(req.body.password);
  }

  // copy params to user and save
  Object.assign(user, req.body);
  user.updated = Date.now();

  await user.save();

  res.status(200).json({
    success: true,
    data: basicDetails(user)
  });

});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  //users can delete their own account and super admins can delete any account
  if (req.params.id !== req.user.id && req.user.role !== Role.SuperAdmin) {
    return next(new ErrorResponse('Unauthorized!', 401));
  }

  const user = await db.User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found!', 401));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: 'User successfully deleted!'
  });

})

// helper functions
function hash(password) {
  return bcrypt.hashSync(password, 10);
}

function basicDetails(user) {
  const {
    id,
    firstName,
    lastName,
    email,
    contactNumber,
    shippingAddress,
    billingAddress,
    role,
    created,
    updated,
    isVerified,
  } = user;
  return {
    id,
    firstName,
    lastName,
    email,
    role,
    contactNumber,
    shippingAddress,
    billingAddress,
    created,
    updated,
    isVerified,
  };
}
