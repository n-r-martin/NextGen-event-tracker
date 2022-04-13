const router = require('express').Router();

//current location /api/getAddressRoutes

router.get('/:textinput', async (req, res) => {
    try {
        //console.log(req.params.textinput);
        let newCity = req.params.textinput;
        let msgStatus = 'failed';
        let lat = '';
        let lon = '';
        const myApiKey = process.env.OPENWEATHER_API_KEY;
        const weatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${newCity}&limit=1&appid=${myApiKey}`;
        // console.log(`fetching ${weatherUrl}`);
        const fetch = await import('node-fetch');
        const abc = await fetch.default(weatherUrl).then(async resp => {
            if (resp.ok) {
                await resp.json().then(function (data) {
                    // console.log(data);
                    if (data.length > 0) {
                        const checkCity = data[0].name;
                        //console.log(checkCity);
                        if (checkCity.toLowerCase() == newCity.toLowerCase()) { 
                            lat = data[0].lat;
                            lon = data[0].lon;
                            msgStatus = 'ok';
                        }
                    }
                    else {
                        msgStatus = 'failed';
                    };
                    // console.log(`lat: "${lat}", lon: "${lon}"`);
                })
            };
        });
    //--RESPONSE--//
    res.status(200).json({ "message": msgStatus, "lat":lat, "lon":lon });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;