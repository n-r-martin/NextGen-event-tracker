const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const S3 = require("aws-sdk/clients/s3");
require('dotenv').config();

//current location /api/events/

router.post('/eonet', async (req, res) => {
    try {
    const eonetUrl = `https://eonet.sci.gsfc.nasa.gov/api/v3/events?bbox=${req.body.minLong},${req.body.maxLat},${req.body.maxLong},${req.body.minLat}&start=${req.body.dateStart}&end=${req.body.dateEnd}&category=${req.body.eventTypesArr}&limit=${req.body.eventCount}&status=all`;
    // console.log(`eonetUrl is: ${eonetUrl}`);
    // console.log(`req.body is: ${req.body}`);
    // const eonetAPICall = await Post.create({
    const fetch = await import('node-fetch');
    const abc = await fetch.default(eonetUrl)
    .then(async resp => await resp.json())
    .then(async data => {
      // console.log(data);
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
    res.status(200).json(data.features);
  });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/userAdd', async (req, res) => {
  try {
    const region = process.env.AWS_region;
    const id = process.env.AWS_ACCESS_KEY_ID;
    const secret = process.env.AWS_SECRET_ACCESS_KEY;
    const bucket_name = process.env.AWS_S3_Bucket;
    const s3 = new S3({
      region,
      secret,
      id,
    });
    const newData = JSON.stringify(req.body);
    console.log(`newData is: ${newData}`);//delete
    let buf = ""; //Buffer.from(JSON.stringify(newData));
    let objectData = {};

    const getParams = {
      Bucket: bucket_name,
      Key: 'usrAdd-array.json'
    };
    //------Get Contents of Existing File------//
    const fileDownload = await s3.getObject(getParams).promise()
    .then(async (data) => {
      if(data.ContentLength < 10){
        console.log(`no data in file`);
        let objectDataAry = [];
        objectDataAry.push(JSON.parse(newData));
        // console.log(`objectDataAry is: ${JSON.stringify(objectDataAry)}`);
        objectData = objectDataAry;
        buf = Buffer.from(JSON.stringify(objectData));
      } else {
        console.log(`downloaded successfully. ${data.Location}`);
        let objectData = JSON.parse(data.Body.toString());
        let objectDataAry = [];
        objectDataAry = JSON.parse(JSON.stringify(objectData));
        objectDataAry.push(JSON.parse(newData));
        objectData = objectDataAry;
        buf = Buffer.from(JSON.stringify(objectData));
      }
    })
    .catch((err) => {
        throw err;
    });
    let s3InputData = {
      Bucket: bucket_name,
      Key: 'usrAdd-array.json',
      Body: buf,
      ContentType: 'application/json'
    };
    //------UPLOAD New file------//
    const fileUpload = await s3.upload(s3InputData).promise()
    .then((data) => {
        console.log(`uploaded successfully. ${data.Location}`);
    })
    .catch((err) => {
        throw err;
    });
    console.log('success');//delete
    res.status(200).json({"message":"success"});
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;