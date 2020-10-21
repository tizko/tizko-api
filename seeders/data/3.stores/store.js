const faker = require('faker');
const ObjectId = require('mongodb').ObjectId;

module.exports = [
  {
    _id: new ObjectId("5f68d23709787424cfa4950a"),
    name: "SM City Baguio",
    description: "SM City Baguio is an enclosed shopping mall located at the former Pines Hotel in the City of Baguio in the Philippines. At a floor area of 160,000 m2 (1,700,000 sq ft), it is the largest shopping mall in the whole North Luzon Region. The entire complex stands on a land area of 80,000 m2 (860,000 sq ft) on Luneta Hill on top of Session Road overlooking historic Burnham Park and opposite Baguio's City Hall which is situated on a northern hill.",
    image: "http://image.com",
    contactNumber: faker.phone.phoneNumber('+639#########'),
    location: "SM City Baguio Luneta Hill, Upper Session Rd, Baguio, 2600 Benguet",
    admins: [new ObjectId("5efec5f82516e36a501ceaaa"), new ObjectId("5efea341cb4e4c61fafb8c35")],
    customers: [new ObjectId("5c8a1d5b0190b214360dc031"), new ObjectId("5c8a1d5b0190b214360dc032")],
    created: faker.date.past(),
    updated: faker.date.recent()
  },
  {
    _id: new ObjectId("5f68d48223625125ce3159ba"),
    name: "C & Triple A",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    image: "http://image.com",
    contactNumber: faker.phone.phoneNumber('+639#########'),
    location: "Camp 7 Kennon Road, Baguio City, 2600 Benguet",
    admins: [new ObjectId("5efec5f82516e36a501ceaaa"), new ObjectId("5efea341cb4e4c61fafb8c35")],
    customers: [new ObjectId("5c8a1d5b0190b214360dc031"), new ObjectId("5c8a1d5b0190b214360dc032")],
    created: faker.date.past(),
    updated: faker.date.recent()
  },
  {
    _id: new ObjectId("5f7d0c7030268f70e90db920"),
    name: "Puregold",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    image: "http://image.com",
    contactNumber: faker.phone.phoneNumber('+639#########'),
    location: "Cooyeesan Hotel Plaza, Naguilian corner Asin Road  s, Baguio City 2600",
    admins: [new ObjectId("5efec5f82516e36a501ceaaa"), new ObjectId("5efea341cb4e4c61fafb8c35")],
    customers: [new ObjectId("5c8a1d5b0190b214360dc031"), new ObjectId("5c8a1d5b0190b214360dc032")],
    created: faker.date.past(),
    updated: faker.date.recent()
  },
  {
    _id: new ObjectId("5f7d0d6f30268f70e90db921"),
    name: "Benguet Supermart",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    image: "http://image.com",
    contactNumber: faker.phone.phoneNumber('+639#########'),
    location: "Prime Hotel, F. Calderon Street, Baguio City, Benguet 2600",
    admins: [new ObjectId("5efec5f82516e36a501ceaaa"), new ObjectId("5efea341cb4e4c61fafb8c35")],
    customers: [new ObjectId("5c8a1d5b0190b214360dc031"), new ObjectId("5c8a1d5b0190b214360dc032")],
    created: faker.date.past(),
    updated: faker.date.recent()
  },
  {
    _id: new ObjectId("5f7d0dcb30268f70e90db922"),
    name: "Tiongsan Supermarket",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    image: "http://image.com",
    contactNumber: faker.phone.phoneNumber('+639#########'),
    location: "Harrison Rd., Baguio City, Benguet 2600",
    admins: [new ObjectId("5f8fefcdc3e019936e1fc7b7"), new ObjectId("5efea341cb4e4c61fafb8c35")],
    customers: [new ObjectId("5c8a1d5b0190b214360dc031"), new ObjectId("5f8fefd60488fc06f488a533")],
    created: faker.date.past(),
    updated: faker.date.recent()
  }
]

