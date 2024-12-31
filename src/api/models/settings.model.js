const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database/config.js");

class Settings extends Model {}

Settings.init(
  {
    settings_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    port: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    darkMode: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    notifications: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Settings",
    tableName: "settings",
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = Settings;
