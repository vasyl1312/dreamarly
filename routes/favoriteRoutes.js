const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Dream = require("../models/dreams");

router.post("/add/:dreamId", async (req, res) => {
  try {
    if (!req.session.user) {
      req.session.alert = { type: "danger", message: "You must be logged in to add favorites." };
      return res.redirect("/auth/login");
    }

    const user = await User.findById(req.session.user._id);
    const dream = await Dream.findById(req.params.dreamId);

    if (!dream) {
      req.session.alert = { type: "danger", message: "Dream not found." };
      return res.redirect("/all_dreams");
    }

    if (dream.author && dream.author.toString() === user._id.toString()) {
      req.session.alert = {
        type: "warning",
        message: "You cannot add your own dream to favorites.",
      };
      return res.redirect("/all_dreams");
    }

    if (!user.favorites.includes(dream._id)) {
      user.favorites.push(dream._id);
      await user.save();
      req.session.alert = { type: "success", message: "Dream added to favorites!" };
    }

    res.redirect("/all_dreams");
  } catch (error) {
    console.error(error);
    req.session.alert = { type: "danger", message: "Internal Server Error." };
    res.redirect("/all_dreams");
  }
});

router.post("/remove/:dreamId", async (req, res) => {
  try {
    if (!req.session.user) {
      req.session.alert = { type: "danger", message: "You must be logged in to remove favorites." };
      return res.redirect("/auth/login");
    }

    const user = await User.findById(req.session.user._id);
    user.favorites = user.favorites.filter((id) => id.toString() !== req.params.dreamId);
    await user.save();

    req.session.alert = { type: "success", message: "Dream removed from favorites!" };
    res.redirect("/profile/favorites");
  } catch (error) {
    console.error(error);
    req.session.alert = { type: "danger", message: "Internal Server Error." };
    res.redirect("/profile/favorites");
  }
});

module.exports = router;
