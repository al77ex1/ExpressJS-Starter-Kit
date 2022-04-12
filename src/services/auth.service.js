const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

const checkUserHelper = (user) => {
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {object}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password)))
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');

  await user.privateFields(['password', 'createdAt', 'updatedAt']);
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    where: { token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false },
  });
  if (!refreshTokenDoc) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');

  await Token.destroy({ where: { token: refreshToken } });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {string}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    checkUserHelper(user);

    await Token.destroy({ where: { token: refreshTokenDoc.token } });
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Please authenticate. ${error}`);
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    checkUserHelper(user);

    await userService.updateUserById(user.id, { password: newPassword });
    await Token.destroy({ where: { user: user.id, type: tokenTypes.RESET_PASSWORD } });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @return {object}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    checkUserHelper(user);

    await Token.destroy({ where: { user: user.id, type: tokenTypes.VERIFY_EMAIL } });
    await userService.updateUserById(user.id, { isEmailVerified: true });
    return user.reload();
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Email verification failed. ${error}`);
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
