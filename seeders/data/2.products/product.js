const faker = require('faker');
const ObjectId = require('mongodb').ObjectID;

let data = [];

// create 10 products for store 1
for (let i = 0; i < 10; i++) {
  let store1 = {
    _id: new ObjectId(),
    sku: faker.finance.iban(),
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(),
    image: [faker.random.image(), faker.random.image(), faker.random.image()],
    weight: Math.random() * (25 - 1),
    price: Math.random() * (1000 - 10) + 10,
    category: faker.commerce.productMaterial(),
    stock: faker.random.number(),
    created: faker.date.past(),
    updated: faker.date.recent(),
    store: new ObjectId('5f68d23709787424cfa4950a')
  };

  // data.push(product);
  data = [...data, store1];
}
// create 10 products for store 2
for (let i = 0; i < 10; i++) {
  let store2 = {
    _id: new ObjectId(),
    sku: faker.finance.iban(),
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(),
    image: [faker.random.image(), faker.random.image(), faker.random.image()],
    weight: Math.random() * (25 - 1),
    price: Math.random() * (1000 - 10) + 10,
    category: faker.commerce.productMaterial(),
    stock: faker.random.number(),
    created: faker.date.past(),
    updated: faker.date.recent(),
    store: new ObjectId('5f68d48223625125ce3159ba')
  };

  // data.push(product);
  data = [...data, store2];
}

// create 10 products for store 3
for (let i = 0; i < 10; i++) {
  let store3 = {
    _id: new ObjectId(),
    sku: faker.finance.iban(),
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(),
    image: [faker.random.image(), faker.random.image(), faker.random.image()],
    weight: Math.random() * (25 - 1),
    price: Math.random() * (1000 - 10) + 10,
    category: faker.commerce.productMaterial(),
    stock: faker.random.number(),
    created: faker.date.past(),
    updated: faker.date.recent(),
    store: new ObjectId('5f7d0c7030268f70e90db920')
  };

  // data.push(product);
  data = [...data, store3];
}

// create 10 products for store 4
for (let i = 0; i < 10; i++) {
  let store4 = {
    _id: new ObjectId(),
    sku: faker.finance.iban(),
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(),
    image: [faker.random.image(), faker.random.image(), faker.random.image()],
    weight: Math.random() * (25 - 1),
    price: Math.random() * (1000 - 10) + 10,
    category: faker.commerce.productMaterial(),
    stock: faker.random.number(),
    created: faker.date.past(),
    updated: faker.date.recent(),
    store: new ObjectId('5f7d0d6f30268f70e90db921')
  };

  // data.push(product);
  data = [...data, store4];
}

// create 10 products for store 5
for (let i = 0; i < 10; i++) {
  let store5 = {
    _id: new ObjectId(),
    sku: faker.finance.iban(),
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(),
    image: [faker.random.image(), faker.random.image(), faker.random.image()],
    weight: Math.random() * (25 - 1),
    price: Math.random() * (1000 - 10) + 10,
    category: faker.commerce.productMaterial(),
    stock: faker.random.number(),
    created: faker.date.past(),
    updated: faker.date.recent(),
    store: new ObjectId('5f7d0dcb30268f70e90db922')
  };

  // data.push(product);
  data = [...data, store5];
}

module.exports = data;
