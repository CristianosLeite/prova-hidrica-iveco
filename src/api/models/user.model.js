const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database/config.js");
const Recipe = require("./recipe.model.js");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    badge_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
    modelName: "User",
    tableName: "users",
    createdAt: true,
    updatedAt: true,
  }
);

User.hasMany(Recipe, {
  foreignKey: "createdBy",
  as: "recipes",
});

Recipe.belongsTo(User, {
  foreignKey: "id",
  as: "user",
});

module.exports = User;
