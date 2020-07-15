const db = require('../_helpers/db.connection');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  const stores = await db.Store.find();

  return stores.map((x) => basicDetails(x));
}

async function getById(id) {
  const store = await getStore(id);

  return basicDetails(store);
}

async function create(params) {
  // might have to refactor the validation 
  if (await db.Store.findOne({ name: params.name })) {
    throw 'Store with the name of "' + params.name + '" already exist!';
  }

  const store = new db.Store(params);

  await store.save();

  return basicDetails(store);
}

async function update(id, params) {
  const store = await getStore(id);
  // might have to refactor the validation
  if (store.name !== params.name && (await db.Store.findOne({ name: params.name }))) {
    throw 'This store already exist!';
  }

  Object.assign(store, params);
  store.updated = Date.now();
  
  await store.save();

  return basicDetails(store);
}

async function _delete(id) {
  const store = await getStore(id);

  await store.remove();
}

//helper functions
function basicDetails(store) {
  const { id, name, description, image, location, products } = store;

  return { id, name, description, image, location, products };
}

async function getStore(id) {
  if (!db.isValidId(id)) throw 'Store not found!';

  const store = await db.Store.findById(id);

  if (!store) throw 'Store not found!';

  return store;
}
