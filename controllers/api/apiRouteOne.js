const router = require('express').Router();
const { ModelOne } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const ContentData = await ModelOne.findAll();
        res.status(200).json(ContentData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
