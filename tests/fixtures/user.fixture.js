const faker = require('faker');
const { User } = require('../../src/models');

const password = 'password1';

const userOne = {
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const userTwo = {
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const admin = {
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  const createdUsers = await User.bulkCreate(users, { individualHooks: true });
  return createdUsers;
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
