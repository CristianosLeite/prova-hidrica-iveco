const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database/config.js");

class Recipe extends Model {}

Recipe.init(
  {
    recipe_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sprinkler_height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Recipe",
    tableName: "recipes",
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = Recipe;
