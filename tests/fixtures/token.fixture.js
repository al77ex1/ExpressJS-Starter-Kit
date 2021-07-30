const moment = require('moment');
const config = require('../../src/config/config');
const { tokenTypes } = require('../../src/config/tokens');
const tokenService = require('../../src/services/token.service');

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = (userId) => {
  return tokenService.generateToken(userId, accessTokenExpires, tokenTypes.ACCESS);
};
const adminAccessToken = (userId) => {
  return tokenService.generateToken(userId, accessTokenExpires, tokenTypes.ACCESS);
};

module.exports = {
  userOneAccessToken,
  adminAccessToken,
};
