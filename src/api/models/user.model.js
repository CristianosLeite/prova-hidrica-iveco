const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database/config.js");
const Recipe = require("./recipe.model.js");

class User extends Model {}

User.init(
  {
    Id: {
      type: DataTypes.STRING,
      field: "id",
      primaryKey: true
    },
    UserName: {
      type: DataTypes.STRING,
      field: "user_name",
      allowNull: false
    },
    BadgeNumber: {
      type: DataTypes.STRING,
      field: "badge_number",
      allowNull: false,
      unique: true
    },
    Permissions: {
      field: "permissions",
      type: DataTypes.ARRAY(DataTypes.STRING)
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users"
  }
);

User.hasMany(Recipe, {
  foreignKey: "createdBy",
  as: "recipes"
});

Recipe.belongsTo(User, {
  foreignKey: "createdBy",
  as: "user"
});

module.exports = User;
