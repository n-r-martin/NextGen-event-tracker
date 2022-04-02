const router = require('express').Router();
const { ModelOne, ModelTwo } = require('../models');

router.get('/', async (req, res) => {
  try {
    const queryOneData = await ModelOne.findAll();
    const ContentData = {
      "id": queryOneData[0].dataValues.id,
      "content": queryOneData[0].dataValues.content,
    };

    const queryTwoData = await ModelTwo.findAll();
    const subContentData = {
      "id": queryTwoData[0].dataValues.id,
      "SubContent": queryTwoData[0].dataValues.SubContent,
      "one_id": queryTwoData[0].dataValues.one_id,
    };

    res.render('content', { 
      ContentData, 
      subContentData 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

