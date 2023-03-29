const express = require("express");
const { loginRequired } = require("../controllers/auth");
const router = express.Router();
const Activity = require("../models/activity");

// get home page
router.post("/create", (req, res, next) => {
  const { title, description, comment, imageUrl } = req.body;

  Activity.create({
    title,
    description,
    comment,
    imageUrl,
    owner: req.session.userId,
  });
});

router.get("/:idActividad", loginRequired, (req, res) => {
  res.redirect(`/subject/${req.params["idActividad"]}`);
});

module.exports = router;
