const express = require("express");
const router = express.Router();

// get home page
router.get("/", (req, res, next) => {
  res.redirect("/calendar");
});


module.exports = router;
