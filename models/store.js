const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: Date,
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
});

module.exports = mongoose.model('Store', schema);