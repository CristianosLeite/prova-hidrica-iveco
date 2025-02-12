const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database/config.js");
const Activity = require("./activity.model.js");

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
      type: DataTypes.BIGINT,
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

User.hasMany(Activity, {
  foreignKey: "id",
  as: "activities",
});

Activity.belongsTo(User, {
  foreignKey: "id",
  as: "user",
});

module.exports = User;
