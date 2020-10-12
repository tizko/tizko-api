const db = require('../utils/db.connection');
const bcrypt = require('bcryptjs');

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: _delete,
};

async function create(params) {
  // validate
  if (await db.User.findOne({ email: params.email })) {
    throw 'Email "' + params.email + '" is already registerd!';
  }

  const user = new db.User(params);
  user.verified = Date.now();

  // hash password
  if (params.password) {
    user.passwordHash = hash(params.password);
  }

  // save user account
  await user.save();

  return basicDetails(user);
}

async function getAll() {
  const users = await db.User.find();

  return users.map((x) => basicDetails(x));
}

async function getById(id) {
  const user = await getUser(id);

  return basicDetails(user);
}

async function update(id, params) {
  const user = await getUser(id);

  //validated
  if (
    user.email !== params.email &&
    (await db.User.findOne({ email: params.email }))
  ) {
    throw 'Email "' + params.email + '" is already taken!';
  }

  //hash password if it was entered
  if (params.password) {
    params.passwordHash = hash(params.password);
  }

  // copy params to user and save
  Object.assign(user, params);
  user.updated = Date.now();

  await user.save();

  return basicDetails(user);
}

async function _delete(id) {
  const user = await getUser(id);

  await user.remove();
}

// helper functions

async function getUser(id) {
  if (!db.isValidId(id)) throw 'User Account not found!';

  const user = await db.User.findById(id);

  if (!user) throw 'User Account not found!';

  return user;
}

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
