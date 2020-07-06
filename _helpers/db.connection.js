const config = require('../config/db.config');
const mongoose = require('mongoose');
const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(process.env.MONGODB_URI || config.local.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
  User: require('../models/user'),
  RefreshToken: require('../models/refresh-token'),
  Product: require('../models/product'),
  isValidId
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
