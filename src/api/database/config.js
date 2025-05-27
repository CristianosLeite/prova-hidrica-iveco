const { Sequelize } = require("sequelize");
require('dotenv').config();

const dbConfig = {
  host: process.env["DATABASE_HOST"],
  port: process.env["DATABASE_PORT"],
  user: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
  db: process.env["DATABASE_NAME"],
  dialect: process.env["DIALECT_DATABASE"],
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

module.exports = { dbConfig, sequelize };
