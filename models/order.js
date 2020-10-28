const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  status: { type: String, require: true },
  fullfillmentStatus: { type: String, require: true },
  total: { type: Number, require: true },
  created: { type: Date, default: Date.now },
  updated: Date,
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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

module.exports = mongoose.model('Order', schema)
