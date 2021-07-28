const { Sequelize } = require('sequelize');
const envVars = require('../../src/config/config');
const logger = require('../../src/config/logger');
const { User } = require('../../src/models');

const setupTestDB = () => {
  let sequelize = {};
  beforeAll(async () => {
    const config = {
      host: envVars[process.env.NODE_ENV].host,
      dialect: envVars[process.env.NODE_ENV].dialect,
      dialectOptions: {
        charset: 'utf8',
      },
      define: {
        timestamps: false,
      },
      logging: false,
    };

    sequelize = new Sequelize(
      envVars[process.env.NODE_ENV].database,
      envVars[process.env.NODE_ENV].username,
      envVars[process.env.NODE_ENV].password,
      config
    );

    await sequelize.authenticate().then(() => logger.info('Connected to DB'));
  });

  beforeEach(async () => {
    await User.destroy({ truncate: { cascade: true } });
  });

  afterAll(async () => {
    await sequelize.close();
  });
};

module.exports = setupTestDB;
