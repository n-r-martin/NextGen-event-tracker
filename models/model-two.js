const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ModelTwo extends Model {}

ModelTwo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    SubContent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    one_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'modelone',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'modeltwo',
  }
);

module.exports = ModelTwo;
