const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  sku: { type: String, require: true },
  name: { type: String, require: true },
  description: { type: String, require: true },
  image: { type: Array, require: true },
  price: { type: Number, require: true },
  weight: { type: Number, require: true },
  category: { type: String },
  stock: { type: Number, require: true },
  created: { type: Date, default: Date.now },
  updated: Date,
});

schema.virtual('inStock').get(function () {
  return this.stock !== 0;
});

module.exports = mongoose.model('Product', schema)
