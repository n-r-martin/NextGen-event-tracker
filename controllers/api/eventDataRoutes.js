const router = require('express').Router();

//current location /api/eonet

router.post('/', async (req, res) => {
    try {
    const eonetUrl = `https://eonet.sci.gsfc.nasa.gov/api/v3/events?bbox=${req.body.minLong},${req.body.maxLat},${req.body.maxLong},${req.body.minLat}&start=${req.body.dateStart}&end=${req.body.dateEnd}&category=${req.body.eventTypesArr}&limit=${req.body.eventCount}&status=all`;
    console.log(`eonetUrl is: ${eonetUrl}`);
    console.log(`req.body is: ${req.body}`);
    // const eonetAPICall = await Post.create({
    const fetch = await import('node-fetch');
    const abc = await fetch.default(eonetUrl).then(async resp => await resp.json())
    .then(async data => {
    // .then(async resp => {
        // if (resp.ok) {
            // await resp.json().then(function (data) {
                console.log(data);
                res.status(200).json(data);

                // if (data.length > 0) {
                //     const checkCity = data[0].name;
                //     console.log(checkCity);
                //     if (checkCity.toLowerCase() == newCity.toLowerCase()) { 
                //         lat = data[0].lat;
                //         lon = data[0].lon;
                //         msgStatus = 'ok';
                //     }
                // }
                // else {
                //     msgStatus = 'failed';
                // };
            });
        // };
    // });

    // console.log(`abc is: ${abc}`);
    // let reqData = [];
    // reqData.push({minLong:`${req.body.minLong}`});
  

    } catch (err) {
      res.status(400).json(err);
    }
  });

module.exports = router;