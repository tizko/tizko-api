const faker = require('faker');
const ObjectId = require('mongodb').ObjectID;

let data = [];

for (let i = 0; i < 10; i++) {
  let product = {
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
    updated: faker.date.recent()
  }

  data.push(product);
}

module.exports = data;
