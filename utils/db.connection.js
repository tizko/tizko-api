// const config = require('../config/db.config');
const mongoose = require('mongoose');
const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(process.env.MONGODB_URI, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
  User: require('../models/User'),
  RefreshToken: require('../models/Refresh-Token'),
  Product: require('../models/Product'),
  Store: require('../models/Store'),
  Order: require('../models/order'),
  isValidId
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
