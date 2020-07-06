const db = require('../_helpers/db.connection');
const product = require('../models/product');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  const products = await db.Product.find();

  return products.map((x) => basicDetails(x));
}

async function getById(id) {
  const product = await getProduct(id);

  return basicDetails(product);
}

async function create(params) {
  // validate if product already exist
  if (await db.Product.findOne({ sku: params.sku })) {
    throw 'Product with SKU of "' + params.sku + '" already exist!';
  }

  const product = new db.Product(params);

  await product.save();

  return basicDetails(product);
}

async function update(id, params) {}

async function _delete(id) {}

//helper functions

function basicDetails(product) {
  const {
    id,
    sku,
    name,
    description,
    image,
    price,
    weight,
    category,
    created,
    updated,
    inStock,
  } = product;

  return {
    id,
    sku,
    name,
    description,
    image,
    price,
    weight,
    category,
    created,
    updated,
    inStock,
  };
}

async function getProduct(id) {
  if (!db.isValidId(id)) throw 'Product not found!';

  const product = await db.Product.findById(id);

  if (!product) throw 'Product not found!';

  return product;
}
