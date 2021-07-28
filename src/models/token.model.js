const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate(models) {
      this.belongsTo(models.User, { onDelete: 'cascade', foreignKey: { name: 'user', allowNull: false } });
    }
  }

  Token.init(
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      blacklisted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Token',
      tableName: 'token',
      underscored: true,
    }
  );

  return Token;
};
