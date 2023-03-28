const express = require("express");
const router = express.Router();
const Subject = require('../models/subject');
const Activity = require('../models/activity');
const { loginRequired } = require("../controllers/auth");

// crear una asignatura
router.post('/create', loginRequired, (req, res, next) => {
    const { titulo, horario, creditos, color } = req.body;

    Subject.create({ 
        titulo, 
        horario, 
        creditos, 
        color,
        user: req.session.userId
    }).then(()=>{
        res.redirect("/");
    })
});

// mostrar una asignatura
router.get('/:asignaturaId', loginRequired, (req, res, next) => {
    Subject.findById(req.params.asignaturaId)
        .then((asignatura)=>{
            if(asignatura.user == req.session.user._id){
                res.render('',asignatura);
            }else{
                res.redirect('/');
            }
        })
});

// eliminar una asignatura
router.post('/:asignaturaId/remove', loginRequired, (req, res, next) => {
    Subject.findById(req.params.asignaturaId)
        .then((asignatura)=>{
            if(asignatura.user == req.session.user._id){
                Activity.deleteMany({subject: asignatura._id})
                .then(()=>{
                    Subject.findByIdAndRemove(req.params.asignaturaId)
                    .then(()=>{
                        res.redirect('/');
                    })
                })
            }else{
                res.redirect('/');
            }
        })
});
  


module.exports = router;
