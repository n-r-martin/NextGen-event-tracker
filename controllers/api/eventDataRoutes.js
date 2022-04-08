const router = require('express').Router();

//current location /api/events/

router.post('/eonet', async (req, res) => {
    try {
    const eonetUrl = `https://eonet.sci.gsfc.nasa.gov/api/v3/events?bbox=${req.body.minLong},${req.body.maxLat},${req.body.maxLong},${req.body.minLat}&start=${req.body.dateStart}&end=${req.body.dateEnd}&category=${req.body.eventTypesArr}&limit=${req.body.eventCount}&status=all`;
    console.log(`eonetUrl is: ${eonetUrl}`);
    console.log(`req.body is: ${req.body}`);
    // const eonetAPICall = await Post.create({
    const fetch = await import('node-fetch');
    const abc = await fetch.default(eonetUrl)
    .then(async resp => await resp.json())
    .then(async data => {
      console.log(data);
      res.status(200).json(data.events);
    });

    } catch (err) {
      res.status(400).json(err);
    }
});

router.post('/usgs', async (req, res) => {
  try {
  const usgsUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${req.body.dateStart}&endtime=${req.body.dateEnd}&minlatitude=${req.body.minLat}&minlongitude=${req.body.minLong}&maxlatitude=${req.body.maxLat}&maxlongitude=${req.body.maxLong}&limit=${req.body.eventCount}&minmagnitude=2.9`;
  // console.log(`usgsUrl is: ${usgsUrl}`);
  // console.log(`req.body is: ${req.body}`);
  const fetch = await import('node-fetch');
  const abc = await fetch.default(usgsUrl)
  .then(async resp => await resp.json())
  .then(async data => {
    // console.log(data);
    res.status(200).json(data.features);
  });

  } catch (err) {
    res.status(400).json(err);
  }
});


module.exports = router;