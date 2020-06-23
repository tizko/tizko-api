const expressJwt = require('express-jwt');
const config = require('../_helpers/auth.config.json');
const userController = require('../controllers/userController');

function jwt() {
  const secret = config.secret;
  return expressJwt({
    secret,
    isRevoked,
  }).unless({
    path: [
      //public routes that don't require authentication
      '/users/authenticate',
      '/users/register',
    ],
  });
}

async function isRevoked(req, payload, done) {
  const user = await userController.getById(payload.sub);

  //revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }

  done();
}

module.exports = jwt;