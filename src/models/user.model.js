const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Model } = require('sequelize');
const { roles } = require('../config/roles');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // static associate(models) {}
  }

  User.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 50] },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: { msg: 'Must be a valid email address' } },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          if (!value.match(/\d/) || !value.match(/[a-zA-Z]/))
            throw new Error('Password must contain at least one letter and one number');
          if (value.length < 8) throw new Error('Password must not be less than 8 characters');
          const salt = bcrypt.genSaltSync();
          this.setDataValue('password', bcrypt.hashSync(value, salt));
        },
      },
      role: {
        type: DataTypes.ENUM(roles),
        default: 'user',
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      indexes: [{ unique: true, fields: ['email'] }],
    }
  );

  User.beforeCreate((user) => {
    const newUser = user;
    newUser.id = uuidv4();
  });

  /**
   * Check if password matches the user's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  User.prototype.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
