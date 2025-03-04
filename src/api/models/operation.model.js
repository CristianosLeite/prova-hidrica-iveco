const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database/config.js");
const Recipe = require("./recipe.model.js");

class Operation extends Model {}

Operation.init(
  {
    OperationId: {
      field: "operation_id",
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Vp: {
      field: "vp",
      type: DataTypes.STRING,
      allowNull: false,
    },
    Van: {
      field: "van",
      type: DataTypes.STRING,
      allowNull: false,
    },
    Operator: {
      field: "operator",
      type: DataTypes.STRING,
      allowNull: false,
    },
    Recipe: {
      field: "recipe",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    StartTime: {
      field: "start_time",
      type: DataTypes.DATE,
      allowNull: false,
    },
    EndTime: {
      field: "end_time",
      type: DataTypes.DATE,
      allowNull: false,
    },
    InfPoint1: {
      field: "inf_point1",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint2: {
      field: "inf_point2",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint3: {
      field: "inf_point3",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint4: {
      field: "inf_point4",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint5: {
      field: "inf_point5",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint6: {
      field: "inf_point6",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint7: {
      field: "inf_point7",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint8: {
      field: "inf_point8",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint9: {
      field: "inf_point9",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint10: {
      field: "inf_point10",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint11: {
      field: "inf_point11",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint12: {
      field: "inf_point12",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint13: {
      field: "inf_point13",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint14: {
      field: "inf_point14",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint15: {
      field: "inf_point15",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint16: {
      field: "inf_point16",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint17: {
      field: "inf_point17",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint18: {
      field: "inf_point18",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint19: {
      field: "inf_point19",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint20: {
      field: "inf_point20",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint21: {
      field: "inf_point21",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint22: {
      field: "inf_point22",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint23: {
      field: "inf_point23",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint24: {
      field: "inf_point24",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint25: {
      field: "inf_point25",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint26: {
      field: "inf_point26",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint27: {
      field: "inf_point27",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint28: {
      field: "inf_point28",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint29: {
      field: "inf_point29",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint30: {
      field: "inf_point30",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint31: {
      field: "inf_point31",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint32: {
      field: "inf_point32",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    InfPoint33: {
      field: "inf_point33",
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    CreatedAt: {
      field: "createdAt",
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Operation",
    tableName: "operations",
    createdAt: true,
    updatedAt: false,
  }
);

Operation.belongsTo(Recipe, {
  foreignKey: "Recipe",
  as: "recipe",
});

module.exports = Operation;
