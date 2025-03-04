const { sequelize } = require("./config.js");
const Operation = require("../models/operation.model.js");
const User = require("../models/user.model.js");
const Recipe = require("../models/recipe.model.js");
const Settings = require("../models/settings.model.js");

async function connect() {
  await sequelize
    .authenticate()
    .then(async () => {
      console.log("Conexão com banco de dados estabelecida com sucesso!");

      addUUIDExtension();

      createOperationsTable();
      createUsersTable();
      createRecipesTable();
      createSettingsTable();
    })
    .catch((error) => {
      console.error("Não foi possível conectar ao banco de dados: ", error);
    });
}

async function createTables() {
  await sequelize
    .sync({ force: false })
    .then(() => {
      console.log("Tabelas criadas com sucesso.");
    })
    .catch((error) => {
      console.error("Erro ao criar as tabelas: ", error);
    });
}

async function addUUIDExtension() {
  await sequelize
    .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => {
      console.log("Extensão UUID adicionada com sucesso.");
    })
    .catch((error) => {
      console.error("Não foi possível adicionar a extensão UUID: ", error);
    });
}

async function createOperationsTable() {
  await Operation.sync({ force: false })
    .then(() => {
      console.log("Tabela de operações criada com sucesso.");
    })
    .catch((error) => {
      console.error("Não foi possível criar a tabela de operações: ", error);
    });
}

async function createUsersTable() {
  await User.sync({ force: false })
    .then(() => {
      console.log("Tabela de usuários criada com sucesso.");
    })
    .catch((error) => {
      console.error("Não foi possível criar a tabela de usuários: ", error);
    });
}

async function createRecipesTable() {
  await Recipe.sync({ force: false })
    .then(() => {
      console.log("Tabela de receitas criada com sucesso.");
    })
    .catch((error) => {
      console.error("Não foi possível criar a tabela de receitas: ", error);
    });
}

async function createSettingsTable() {
  await Settings.sync({ force: false })
    .then(() => {
      console.log("Tabela de configurações criada com sucesso.");
    })
    .catch((error) => {
      console.error(
        "Não foi possível criar a tabela de configurações: ",
        error
      );
    });
}

module.exports = { connect, createTables };
