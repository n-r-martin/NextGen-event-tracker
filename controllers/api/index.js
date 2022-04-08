const router = require('express').Router();
const userRoutes = require('./userRoutes');
const apiRouteOne = require('./apiRouteOne');
const apiRouteTwo = require('./apiRouteTwo');
const location = require('./locationRoutes');
const getAddressRoutes = require('./getAddressRoutes')
const eventDataRoutes = require('./eventDataRoutes')

router.use('/users', userRoutes);
router.use('/routeone', apiRouteOne);
router.use('/routetwo', apiRouteTwo);
router.use('/location', location);
router.use('/getaddress', getAddressRoutes )
router.use('/events', eventDataRoutes);
module.exports = router;
