const express = require("express");
const router = express.Router();
const Subject = require('../models/subject')

// get home page
router.post('/create', (req, res, next) => {
    const { titulo, horario, creditos, color } = req.body;
  
    Subject.create({ 
        titulo, 
        horario, 
        creditos, 
        color,
        user: req.session.user._id
     })
  });
  


module.exports = router;
