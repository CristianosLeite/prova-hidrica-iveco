const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database/config.js");
const Recipe = require("./recipe.model.js");
const Operation = require("./operation.model.js");

class User extends Model {}

User.init(
  {
    Id: {
      type: DataTypes.STRING,
      field: "id",
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
      primaryKey: true,
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
    tableName: "users",
    createdAt: false,
    updatedAt: false
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

User.hasMany(Operation, {
  foreignKey: "Operator",
  as: "operations"
});

Operation.belongsTo(User, {
  foreignKey: "Operator",
  as: "user"
});

module.exports = User;
