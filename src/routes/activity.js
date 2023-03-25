const express = require("express");
const router = express.Router();
const Activity = require('../models/activity')

// get home page
router.post('/create', (req, res, next) => {
    const { title, description, comment, imageUrl } = req.body;
  
    Activity.create({
      title,
      description,
      comment,
      imageUrl,
      owner: req.session.currentUser._id
    })
  });
  


module.exports = router;
