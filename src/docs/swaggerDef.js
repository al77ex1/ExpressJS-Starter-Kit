const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'expressjs-starter-kit API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/al77ex1/expressjs-starter-kit',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
