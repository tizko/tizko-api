const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  contactNumber: { type: String, required: true },
  location: { type: String, required: true },
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  created: { type: Date, default: Date.now },
  updated: Date,
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: false
});

// Cascade delete products when a store is deleted
schema.pre('remove', async function(next) {
  console.log(`Products being removed from store ${this._id}`);
  await this.model('Product').deleteMany({ store: this._id });
  next();
});

// revese populate with virtuals
schema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'store',
  justOne: false
});

module.exports = mongoose.model('Store', schema);
