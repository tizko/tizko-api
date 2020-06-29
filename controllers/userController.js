const config = require('../_helpers/auth.config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models').User;

module.exports = {
  authenticate,
  create,
  getAll,
  getById,
  update,
  delete: _delete,
};

async function authenticate({ email, password }) {
  const user = await User.findOne({ where: { email: email } });
  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    const token = jwt.sign({ sub: user.id }, config.secret);
    return {
      ...user.toJSON(),
      token,
    };
  }
}

async function create(userParam) {
  //validate
  if (await User.findOne({ where: { email: userParam.email } })) {
    throw 'Email "' + userParam.email + '" is already taken!';
  }

  const user = User.build(userParam);

  //hash password
  if (userParam.password) {
    user.passwordHash = bcrypt.hashSync(userParam.password, 10);
  }

  await user.save();

  const token = jwt.sign({ sub: user.id }, config.secret);
  
  return { 
    token 
  };
}

async function getAll() {
  return await User.findAll();
}

async function getById(id) {
  return await User.findByPk(id);
}

async function update(id, userParam) {
  const user = await User.findByPk(id);

  if (!user) throw 'User not found!';

  if (
    user.email !== userParam.email &&
    (await User.findOne({ where: { email: userParam.email } }))
  ) {
    throw 'Email "' + userParam.email + '" is already taken!';
  }

  //hash password if it was entered
  if (userParam.password) {
    user.passwordHash = bcrypt.hashSync(userParam.password, 10);
  }

  Object.assign(user, userParam);

  await user.save();
}

async function _delete(id) {
  await User.destroy({
    where: {
      id: id,
    },
  });
}
