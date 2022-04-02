const router = require('express').Router();
const apiRouteOne = require('./apiRouteOne');
const apiRouteTwo = require('./apiRouteTwo');

router.use('/routeone', apiRouteOne);
router.use('/routetwo', apiRouteTwo);

module.exports = router;
