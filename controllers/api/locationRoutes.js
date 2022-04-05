const router = require('express').Router();
const { Location } = require('../../models');

//current route /api/location

router.get('/:city_name?', async (req, res) => {

  try{
    console.log(typeof req.params.city_name);

    const locationData = await Location.findOne({
      where: {
        city_name: req.params.city_name,
      }
    });
    console.log(locationData);
    if (!locationData) {
      res.status(404).json({ message: `That location doesn't exist.`});
      return;
    }
    res.status(200).json(locationData);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;