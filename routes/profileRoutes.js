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
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Dream.findOneAndDelete({ _id: req.params.id, author: req.session.user._id });
    return res.redirect("/profile");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/edit_dream/:id", isAuthenticated, async (req, res) => {
  try {
    const dream = await Dream.findOne({ _id: req.params.id, author: req.session.user._id });

    if (!dream) {
      return res.redirect("/profile");
    }

    return res.render("editDream", { dream });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/edit_dream/:id", isAuthenticated, async (req, res) => {
  try {
    await Dream.findOneAndUpdate(
      { _id: req.params.id, author: req.session.user._id },
      {
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
      }
    );

    return res.redirect("/profile");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
