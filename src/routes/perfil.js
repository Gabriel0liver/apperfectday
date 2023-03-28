const express = require("express");
const router = express.Router();
const User = require('../models/user')

//mostrar perfil
router.get('/', loginRequired, (req, res, next) => {
    User.findById(req.session.user._id)
        .then((user)=>{
            res.render('',user);
        })
});

//editar perfil
router.post('/edit', loginRequired, (req, res, next) => {
    User.findByIdAndUpdate(req.session.user._id,{})
        .then((user)=>{
            res.render('',user);
        })
});
  

module.exports = router;
