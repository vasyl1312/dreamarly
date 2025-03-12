const express = require("express");
const router = express.Router();
const Dream = require("../models/dreams");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const user = req.session.user;
    const dreams = await Dream.find({ author: user._id });

    res.render("profile", { user, dreams });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Dream.findOneAndDelete({ _id: req.params.id, author: req.session.user._id });
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
