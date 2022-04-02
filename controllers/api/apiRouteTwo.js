const router = require('express').Router();
const { ModelTwo } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const subContentData = await ModelTwo.findAll();
        res.status(200).json(subContentData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
