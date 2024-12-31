const { sequelize } = require("./config.js");
const Operation = require("../models/operation.model.js");
const User = require("../models/user.model.js");
const Settings = require("../models/settings.model.js");

async function connect() {
  await sequelize
    .authenticate()
    .then(async () => {
      console.log("Conexão com banco de dados estabelecida com sucesso!");

      // Cria tabela de operações
      await Operation.sync({ force: false })
        .then(() => {
          console.log("Tabela de operações criada com sucesso.");
        })
        .catch((error) => {
          console.error(
            "Não foi possível criar a tabela de operações: ",
            error
          );
        });

      // Cria tabela de usuários
      await User.sync({ force: false })
        .then(() => {
          console.log("Tabela de usuários criada com sucesso.");
        })
        .catch((error) => {
          console.error("Não foi possível criar a tabela de usuários: ", error);
        });

      // Cria tabela de configurações
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

module.exports = { connect, createTables };
