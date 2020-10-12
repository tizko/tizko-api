const { remove } = require('../models/User');
const db = require('../utils/db.connection');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll(params) {
  let products;

  if(params) {
    products = await db.Product.find({ store: params });
  } else {
    products = await db.Product.find();
  }

  return products.map((x) => basicDetails(x));
}

async function getById(id) {
  const product = await getProduct(id);

  return basicDetails(product);
}

async function create(params) {
  // might have to refactor the validation
  if (await db.Product.findOne({ sku: params.sku })) {
    throw 'Product with SKU of "' + params.sku + '" already exist!';
  }

  const product = new db.Product(params);

  await product.save();

  return basicDetails(product);
}

async function update(id, params) {
  const product = await getProduct(id);
  // might have to refactor the validation
  if (product.sku !== params.sku && (await db.Product.findOne({ sku: params.sku }))) {
    throw 'Product with SKU of"' + params.sku + '" already exist!';
  }

  Object.assign(product, params);
  product.updated = Date.now();

  await product.save();

  return basicDetails(product);
}

async function _delete(id) {
  const product = await getProduct(id);

  await product.remove();
}

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
