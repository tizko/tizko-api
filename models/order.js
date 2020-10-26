const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const schema = new Schema({
  // store: { 
  //   type: Schema.Types.ObjectId, 
  //   ref: 'Store'
  // },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product'},
      quantity: { type: Number, default: 1 }
    }
  ],
  totalPrice: { type: Number, default: 0 },
  status: { type: String },
  shipped: { type: Boolean, default: false },
  delivered: { type: Boolean, default: false },
  received: { type: Boolean, default: false },
  rate: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: Date,
});

schema.plugin(deepPopulate);

module.exports = mongoose.model('Order', schema);