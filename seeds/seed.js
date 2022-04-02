const sequelize = require('../config/connection');
const { ModelOne, ModelTwo } = require('../models');

const modeloneData = require('./modeloneData.json');
const modeltwoData = require('./modeltwoData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    await ModelOne.bulkCreate(modeloneData, {
        individualHooks: true,
        returning: true,
    });

    await ModelTwo.bulkCreate(modeltwoData, {
        individualHooks: true,
        returning: true,
    });

    process.exit(0);
};

seedDatabase();
