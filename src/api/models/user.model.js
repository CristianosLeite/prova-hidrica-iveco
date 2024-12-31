const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database/config.js");
const Activity = require("./activity.model.js");

class User extends Model {}

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    badge_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    plant: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
  foreignKey: "user_id",
  as: "activities",
});

Activity.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

module.exports = User;
