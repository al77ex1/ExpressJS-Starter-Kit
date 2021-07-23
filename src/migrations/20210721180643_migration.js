const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "users", deps: []
 * createTable() => "token", deps: [users]
 * addIndex(users_email) => "users"
 *
 */

const info = {
  revision: 1,
  name: "migration",
  created: "2021-07-21T18:06:43.911Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "users",
      {
        id: { type: Sequelize.UUID, field: "id", primaryKey: true },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        email: { type: Sequelize.STRING, field: "email", allowNull: false },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: false,
        },
        role: {
          type: Sequelize.ENUM("user", "admin"),
          field: "role",
          default: "user",
        },
        isEmailVerified: {
          type: Sequelize.BOOLEAN,
          field: "is_email_verified",
          default: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "created_at",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updated_at",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "token",
      {
        token: {
          type: Sequelize.STRING,
          field: "token",
          primaryKey: true,
          allowNull: false,
        },
        type: { type: Sequelize.STRING, field: "type", allowNull: false },
        expires: { type: Sequelize.DATE, field: "expires", allowNull: false },
        blacklisted: {
          type: Sequelize.BOOLEAN,
          field: "blacklisted",
          allowNull: false,
        },
        user: {
          type: Sequelize.UUID,
          field: "user",
          onUpdate: "CASCADE",
          onDelete: "cascade",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "users",
      ["email"],
      {
        indexName: "users_email",
        name: "users_email",
        indicesType: "UNIQUE",
        type: "UNIQUE",
        transaction,
      },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["users", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["token", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
