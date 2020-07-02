const config = require('../config/auth.config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../_helpers/send-email');
const db = require('../_helpers/db.connection');
const Role = require('../_helpers/role');

module.exports = {
  authenticate,
  refreshToken,
  register,
  verifyEmail,
  create,
  getAll,
  getById,
  update,
  delete: _delete,
};

async function authenticate({ email, password, ipAddress }) {
  const user = await db.User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw 'Email or password is incorrect!';
  }

  //authentcation successfull so generate jwt and refresh token
  const jwtToken = generateJwtToken(user);
  const refreshToken = generateRefreshToken(user, ipAddress);

  //save refresh token
  await refreshToken.save();

  //return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: refreshToken.token,
  };
}

async function refreshToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;

  //replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(user, ipAddress);

  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;

  await refreshToken.save();
  await newRefreshToken.save();

  //generate new jwt
  const jwtToken = generateJwtToken(user);


  //return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
  
  
}

async function register(params, origin) {
  // validate
  if (await db.User.findOne({ email: params.email })) {
    // send already registered error in email to prevent account enumeration
    return await sendAlreadyRegisteredEmail(params.email, origin);
  }

  // create user account object
  const user = new db.User(params);

  user.verificationToken = randomTokenString();

  // hash password
  if (params.password) {
    user.passwordHash = hash(params.password);
  }

  // save account
  await user.save();

  await sendVerificationEmail(user, origin);
}

async function verifyEmail({ token }) {
  const user = await db.User.findOne({ verificationToken: token });

  if (!user) throw 'Verification Failed!';

  user.verified = Date.now();
  user.verificationToken = undefined;

  await user.save();
}

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

async function getRefreshToken(token) {
  const refreshToken = await db.RefreshToken.findOne({ token }).populate(
    'user'
  );

  if (!refreshToken || !refreshToken.isActive) throw 'Invalid Token';

  return refreshToken;
}

function hash(password) {
  return bcrypt.hashSync(password, 10);
}

function generateJwtToken(user) {
  // create a jwt token containing the user account id that expires in 15 mins
  return jwt.sign({ sub: user.id, id: user.id }, config.secret, {
    expiresIn: '15m',
  });
}

function generateRefreshToken(user, ipAddress) {
  // create a refresh token that expires in 7 days
  return new db.RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress,
  });
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
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

async function sendVerificationEmail(user, origin) {
  let message;
  if (origin) {
    const verifyUrl = `${origin}/users/verify-email?token=${user.verificationToken}`;
    message = `<p>Please click the below link to verify your email address:</p>
               <p><a href="${verifyUrl}">${verifyUrl}</a></p>
               <p>You can also enter this verification token:</p>
               <p><strong>${user.verificationToken}</strong></p>`;
  } else {
    message = `<p>Please use the below token to verify your email address with the <code>/user/verify-email</code> api route:</p>
               <p><code>${user.verificationToken}</code></p>`;
  }

  await sendEmail({
    to: user.email,
    subject: 'Tizko - Please Verify your Email',
    html: `<h4>Verify Email</h4>
           <p>Thanks for Signing up!</p>
           ${message}`,
  });
}

async function sendAlreadyRegisteredEmail(email, origin) {
  let message;
  if (origin) {
    message = `<p>Someone is trying to Sign up using your email address.</p>
               <p>Please contact us IMMEDIETELY if this was NOT you.</p>`;
  } else {
    message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
  }

  await sendEmail({
    to: email,
    subject: `Tizko - Email Already Registered`,
    html: `<h4>Email Already Registered</h4>
           <p>Your email <strong>${email}</strong> is already registered.</p>
           ${message}`,
  });
}
