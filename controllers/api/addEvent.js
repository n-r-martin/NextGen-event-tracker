const router = require('express').Router();



router.post('/', async (req, res) => {
  try { 
    console.log(req.body);
 
  res.status(200).json()
} catch (err) {
  res.status(400).json(err);
}
});

module.exports = router;
