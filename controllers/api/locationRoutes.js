const router = require('express').Router();
const { Location } = require('../../models');

//current route /api/location

router.get('/:city_name', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    
    //maybe call the weather api in here, using all parameters at once?
    const locationData = await Location.findOne(req.params.city_name, {
      
    });

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