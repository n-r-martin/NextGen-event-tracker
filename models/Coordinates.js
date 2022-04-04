const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Coordinates extends Model {}

Coordinates.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    lat: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lon: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    geometry_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'geometry',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'coordinates',
  }
);


module.exports = Coordinates;
