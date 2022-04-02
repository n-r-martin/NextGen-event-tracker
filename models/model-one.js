const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ModelOne extends Model {}

ModelOne.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'modelone',
  }
);

module.exports = ModelOne;
