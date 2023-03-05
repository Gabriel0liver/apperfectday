const express = require('express');
const router = express.Router();

// get home page
router.get('/', (req, res, next) => {
  res.redirect('calendar/2023/3');
});

module.exports = router;