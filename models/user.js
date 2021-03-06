const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  email: { type: String, unique: true, require: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  acceptTerms: { type: Boolean, required: true },
  shippingAddress: String,
  billingAddress: String,
  role: { type: String, required: true },
  verificationToken: String,
  verified: Date,
  resetToken: {
    token: String,
    expires: Date
  },
  passwordReset: Date,
  created: { type: Date, default: Date.now },
  updated: Date,
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store'
  }
});

//will be used in email verification
schema.virtual('isVerified').get(function () {
  return !!(this.verified || this.passwordReset);
});

schema.virtual('myStore', {
  ref: 'Store',
  localField: '_id',
  foreignField: 'admins',
  justOne: false
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    //remove this props when object is serialized
    delete ret._id;
    delete ret.passwordHash;
  },
});

schema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    //remove this props when object is serialized
    delete ret._id;
    delete ret.passwordHash;
  },
});

module.exports = mongoose.model('User', schema);
