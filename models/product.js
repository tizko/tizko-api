const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  sku: { type: String },
  name: { type: String, require: true },
  description: { type: String, require: true },
  image: { type: Array },
  price: { type: Number, require: true },
  weight: { type: Number },
  category: { type: String },
  stock: { type: Number, require: true },
  created: { type: Date, default: Date.now },
  updated: Date,
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store'
  }
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    //remove this props when object is serialized
    delete ret._id;
  },
});

schema.virtual('inStock').get(function () {
  return this.stock !== 0;
});

module.exports = mongoose.model('Product', schema)
