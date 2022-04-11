const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const convertOptions = require('../utils/convertOptions');

/**
 * Create a user
 * @param {object} userBody
 * @returns {object}
 */
const createUser = async (userBody) => {
  if (await User.count({ where: { email: userBody.email } }))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');

  const user = await User.create(userBody);
  await user.privateFields(['password', 'createdAt', 'updatedAt']);
  return user;
};

/**
 * Query for users
 * @param {object} filter
 * @param {object} options - Query options
 * @param {string} [options.order] - Order option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.offset] - Current offset (default = 1)
 * @returns {object}
 */
const queryUsers = async (filter, options) => {
  const parameters = convertOptions(options);
  // eslint-disable-next-line no-return-await
  return await User.findAndCountAll({
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    where: filter,
    ...parameters,
  });
};

/**
 * Get user by id
 * @param {number} id
 * @returns {object}
 */
const getUserById = async (id) => {
  // eslint-disable-next-line no-return-await
  return await User.findByPk(id, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {object}
 */
const getUserByEmail = async (email) => {
  // eslint-disable-next-line no-return-await
  return await User.findOne({ where: { email } });
};

/**
 * Update user by id
 * @param {number} userId
 * @param {object} updateBody
 * @returns {object}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  await User.update(updateBody, { where: { id: userId } });
  delete user.dataValues.password;

  return user.reload();
};

/**
 * Delete user by id
 * @param {number} userId
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await User.destroy({ where: { id: userId } });
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
