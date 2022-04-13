const router = require('express').Router();
const userRoutes = require('./userRoutes');
const getAddressRoutes = require('./getAddressRoutes');
const eventDataRoutes = require('./eventDataRoutes');

router.use('/users', userRoutes);
router.use('/getaddress', getAddressRoutes );
router.use('/events', eventDataRoutes);

module.exports = router;
