const ModelOne = require('./model-one');
const ModelTwo = require('./model-two');
const User = require('./User');
const Location = require('./Location');
const Event = require('./Event');
const Geometry = require('./Geometry');
const Coordinates = require('./Coordinates');
const Category = require('./Category');

ModelOne.hasMany(ModelTwo, {
  foreignKey: 'one_id',
});

ModelTwo.belongsTo(ModelOne, {
  foreignKey: 'one_id'
});

//key location searches to specific users, so they can be stored as 'favorites'
User.hasMany(Location, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

//Each event has a category
Event.hasOne(Category, {
  foreignKey: 'event_id',
});

Category.belongsTo(Event, {
  foreignKey: 'event_id'
});

//Each event has a Geometry with the coordinates/date inside
Event.hasOne(Geometry, {
  foreignKey: 'event_id',
});

Geometry.belongsTo(Event, {
  foreignKey: 'event_id'
});

//The geometry model holds the coordinates/date
Geometry.hasOne(Coordinates, {
  foreignKey: 'geometry_id',
});

Coordinates.belongsTo(Geometry, {
  foreignKey: 'geometry_id'
});


module.exports = { ModelOne, ModelTwo, User, Location, Event, Geometry, Coordinates, Category };