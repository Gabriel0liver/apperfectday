const express = require("express");
const { loginRequired } = require("../controllers/auth");
const router = express.Router();
const Activity = require("../models/activity");
const User = require("../models/User");


router.get("/:idActividad", loginRequired, async (req, res) => {
  const user = await User.findById(req.session.userId);
  const activity = await Activity.findById(req.params.idActividad);
  if (activity.user == req.session.userId) {
    const isoDateini = activity.inicio.toISOString();
    const isoDatefin = activity.fin.toISOString();
    const isoTimeini = isoDateini.slice(11, 16);
    const isoTimefin = isoDatefin.slice(11, 16); 
    const dia = isoDateini.slice(0, 10);
    const horaini = isoTimeini;
    const horafin = isoTimefin;
    res.render("activity", {
      user,
      activity: {
        id: activity._id,
        titulo: activity.titulo,
        dia: dia,
        inicio: horaini,
        fin: horafin
      },
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
