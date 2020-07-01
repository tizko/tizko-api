const config = require('../config/auth.config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../_helpers/send-email');
const db = require('../_helpers/db.connection');
const Role = require('../_helpers/role');

module.exports = {
  authenticate,
  // register,
  // verifyEmail,
  create,
  getAll,
  getById,
  update,
  delete: _delete,
};

async function authenticate({ email, password, ipAddress }) {
  const user = await db.User.findOne({ email });

  if(!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw 'Email or password is incorrect!';
  }

  //authentcation successfull so generate jwt
  const jwtToken = generateJwtToken(user);

  //return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken
  }
}

// async function register(params, origin) {
//   // validate
//   if (await db.User.findOne({ email: params.email })) {
//     // send already registered error in email to prevent account enumeration
//     return await sendAlreadyRegisteredEmail(params.email, origin);
//   }

//   // create user account object
//   const user = new db.User(params);

//   user.verificationToken = randomTokenString();

//   // hash password
//   if(params.password) {
//     user.passwordHash = hash(params.password);
//   }

//   // save account
//   await user.save();

//   await sendVerificationEmail(user, origin);
// }

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

  return users.map(x => basicDetails(x));
}

async function getById(id) {
  const user = await getUser(id);

  return basicDetails(user);
}

async function update(id, params) {
  const user = await getUser(id);

  //validated
  if(user.email !== params.email && await db.User.findOne({ email: params.email })) {
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
  if(!db.isValidId(id)) throw 'User Account not found!';
  
  const user = await db.User.findById(id);
  
  if(!user) throw 'User Account not found!'
  
  return user;
}

function hash(password) {
  return bcrypt.hashSync(password, 10);
}

function generateJwtToken(user) {
  // create a jwt token containing the user account id that expires in 15 mins
  return jwt.sign({ sub: user.id, id: user.id }, config.secret, { expiresIn: '15m'});
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

function basicDetails(user) {
  const { id, firstName, lastName, email, contactNumber, shippingAddress, billingAddress, role, created, updated, isVerified } = user;
  return { id, firstName, lastName, email, role, contactNumber, shippingAddress, billingAddress, created, updated, isVerified };
}
