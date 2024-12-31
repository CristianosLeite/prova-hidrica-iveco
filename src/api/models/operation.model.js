const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database/config.js");

class Operation extends Model {}

Operation.init(
  {
    operation_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Matrícula
    reg_num: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Desenho
    partnumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_ok: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    // Quantidade de torques
    qty_torque: {
      type: DataTypes.INTEGER,
    },
    // Receita
    recipe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Operation",
    tableName: "operations",
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = Operation;
