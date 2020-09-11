const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  created: { type: Date, default: Date.now },
  updated: Date,
});

module.exports = mongoose.model('Store', schema);
