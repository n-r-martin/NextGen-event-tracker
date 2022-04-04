const ModelOne = require('./model-one');
const ModelTwo = require('./model-two');
const User = require('./User');
const Location = require('./Location')

ModelOne.hasMany(ModelTwo, {
  foreignKey: 'one_id',
});

ModelTwo.belongsTo(ModelOne, {
  foreignKey: 'one_id'
});

module.exports = { ModelOne, ModelTwo, User, Location };