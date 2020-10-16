const app = require('../../app');
const request = require('supertest');
const faker = require('faker');

describe('Auth Endpoints', () => {
  let user;
  beforeEach(() => {
    user = {
      firstName: faker.name.firstName(),
      lastName: 'Castro',
      email: 'patrickcastro@gmail.com',
      passwordHash: bcrypt.hashSync('pass1234', 10),
      role: 'Customer',
      acceptTerms: true,
      contactNumber: faker.phone.phoneNumber('+639#########'),
      shippingAddress: faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.country(),
      billingAddress: faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.country(),
    }
  })
  it('POST /register should create new user and respond success message', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send()
  });

  it('POST /login should respond user details with JWT token', async () => {
    await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'superadmin@tizko.com',
        password: 'superpass1234',
      })
      .expect(200);
  });
});
