const faker = require('faker');
const bcrypt = require('bcryptjs');
const ObjectId = require('mongodb').ObjectId;

module.exports = [
  {
    _id: new ObjectId('5efec5f82516e36a501ceaaa'),
    firstName: 'Patrick',
    lastName: 'Castro',
    email: 'ppcc@tizko.com',
    passwordHash: bcrypt.hashSync('superadmin', 10),
    role: 'SuperAdmin',
    acceptTerms: true,
    contactNumber: faker.phone.phoneNumber('+639#########'),
    shippingAddress: faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.country(),
    billingAddress: faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.country(),
    verified: faker.date.past(),
    created: faker.date.past(),
    updated: faker.date.recent()
  },

  {
    _id: new ObjectId('5efea341cb4e4c61fafb8c35'),
    firstName: 'Karl',
    lastName: 'Balagtey',
    email: 'kmb@tizko.com',
    passwordHash: bcrypt.hashSync('superadmin', 10),
    role: 'SuperAdmin',
    acceptTerms: true,
    contactNumber: faker.phone.phoneNumber('+639#########'),
    shippingAddress: faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.country(),
    billingAddress: faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.country(),
    verified: faker.date.past(),
    created: faker.date.past(),
    updated: faker.date.recent()
  }
]