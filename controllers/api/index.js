const router = require('express').Router();
const userRoutes = require('./userRoutes');
const apiRouteOne = require('./apiRouteOne');
const apiRouteTwo = require('./apiRouteTwo');
const location = require('./locationRoutes');

router.use('/users', userRoutes);
router.use('/routeone', apiRouteOne);
router.use('/routetwo', apiRouteTwo);
router.use('/location', location);

module.exports = router;
