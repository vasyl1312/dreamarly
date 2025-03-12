const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Dream = require("../models/dreams");

router.post("/add/:dreamId", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("You must be logged in to add favorites.");
    }

    const user = await User.findById(req.session.user._id);
    const dream = await Dream.findById(req.params.dreamId);

    if (!dream) {
      return res.status(404).send("Dream not found.");
    }

    if (dream.author && dream.author.toString() === user._id.toString()) {
      return res.status(400).send("You cannot add your own dream to favorites.");
    }

    if (!user.favorites.includes(dream._id)) {
      user.favorites.push(dream._id);
      await user.save();
    }

    res.redirect("/all_dreams");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/remove/:dreamId", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("You must be logged in to remove favorites.");
    }

    const user = await User.findById(req.session.user._id);
    user.favorites = user.favorites.filter((id) => id.toString() !== req.params.dreamId);
    await user.save();

    res.redirect("/profile/favorites");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
