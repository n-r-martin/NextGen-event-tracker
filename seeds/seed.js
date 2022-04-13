const sequelize = require('../config/connection');
const { User, Location } = require('../models');

const userData = require('./userData.json'); 
const locationData = require('./locationSeed.json')

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
      });

    await Location.bulkCreate(locationData, {
        individualHooks: true,
        returning: true,
    });
    
    process.exit(0);
};

seedDatabase();
