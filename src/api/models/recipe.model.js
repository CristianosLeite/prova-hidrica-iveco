const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database/config.js");

class Recipe extends Model {}

Recipe.init(
  {
    RecipeId: {
      type: DataTypes.INTEGER,
      field: "recipe_id",
      autoIncrement: true,
      primaryKey: true,
    },
    Description: {
      type: DataTypes.STRING,
      field: "description",
      allowNull: false,
    },
    Vp: {
      type: DataTypes.STRING,
      field: "vp",
      allowNull: true,
    },
    Cabin: {
      type: DataTypes.STRING,
      field: "cabin",
      allowNull: true,
    },
    SprinklerHeight: {
      type: DataTypes.INTEGER,
      field: "sprinkler_height",
      allowNull: false,
    },
    CreatedBy: {
      type: DataTypes.STRING,
      field: "createdBy",
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
