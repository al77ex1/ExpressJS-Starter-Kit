const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const Umzug = require('umzug');
const envVars = require('../config/config');
const logger = require('../config/logger');

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

const sequelize = new Sequelize(
  envVars[process.env.NODE_ENV].database,
  envVars[process.env.NODE_ENV].username,
  envVars[process.env.NODE_ENV].password,
  config
);
sequelize.authenticate().then(() => logger.info('Connected to DB'));

const User = require('./user.model')(sequelize, DataTypes);
const Token = require('./token.model')(sequelize, DataTypes);

const models = {
  User,
  Token,
};

Object.values(models)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models));

const db = { ...models, sequelize };

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const umzug = new Umzug({
  migrations: {
    path: path.join(__dirname, '../migrations'),
    params: [sequelize.getQueryInterface()],
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize,
  },
});

(async () => {
  if (envVars.umzug !== 'false') {
    await umzug.up();
    logger.info('All migrations performed successfully');
  }
})();

module.exports = db;
