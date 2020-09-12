const { Seeder } = require('mongo-seeding');
const path = require('path');
const db = require('../config/db.config');

const config = {
  database: db.local.connectionString,
  dropDatabase: false
}

const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(path.resolve('./seeders/data'));

const main = async () => {
  try {
    await seeder.import(collections);
    console.log('Seed Complete!');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
}

main();