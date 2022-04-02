const sequelize = require('../config/connection');
const { ModelOne, ModelTwo, User } = require('../models');

const modeloneData = require('./modeloneData.json');
const modeltwoData = require('./modeltwoData.json');
const userData = require('./userData.json'); 

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
      });

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
