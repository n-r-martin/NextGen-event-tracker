const router = require('express').Router();
const Category = require('../../models/Category');

// route to create/add a dish using async/await
router.post('/', async (req, res) => {
  try { 
    console.log(req.body);
  // if the dish is successfully created, the new response will be returned as json
  res.status(200).json()
} catch (err) {
  res.status(400).json(err);
}
});


module.exports = router;
