const ModelOne = require('./model-one');
const ModelTwo = require('./model-two');

ModelOne.hasMany(ModelTwo, {
  foreignKey: 'one_id',
});

ModelTwo.belongsTo(ModelOne, {
  foreignKey: 'one_id'
});

module.exports = { ModelOne, ModelTwo };
