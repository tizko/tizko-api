const Product = require('../models').Product;

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await Product.findAll();
}

async function getById(id) {
  return await Product.findByPk(id);
}

async function create(params) {
  //TO DO: validation
  const product = Product.build(params);

  await product.save();
}

async function update(id, params) {
  const product = await Product.findByPk(id);

  if (!product) throw 'Product not Found!';

  Object.assign(product, params);

  await product.save();
}

async function _delete(id) {
  await Product.destroy({
    where: {
      id: id,
    },
  });
}
