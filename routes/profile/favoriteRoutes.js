const express = require("express");
const router = express.Router();
const User = require("../../models/users");
const Dream = require("../../models/dreams");

router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash("warning", "You must be logged in to view favorites.");
      return res.redirect("/auth/login");
    }

    const sortOption = req.query.sort || "top";
    const user = await User.findById(req.session.user._id).populate("favorites");

    let favorites = user.favorites;

    if (sortOption === "latest") {
      favorites = favorites.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "most_viewed") {
      favorites = favorites.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (["very_cool", "pleasant", "funny", "mind_blown", "weird"].includes(sortOption)) {
      favorites = favorites.sort((a, b) => b.reactions[sortOption] - a.reactions[sortOption]);
    } else {
      favorites = favorites.sort((a, b) => {
        const sumReactions = (r) => r.very_cool + r.pleasant + r.funny + r.mind_blown + r.weird;
        return sumReactions(b.reactions) - sumReactions(a.reactions);
      });
    }

    res.render("profile/favorites", {
      favorites,
      sort: sortOption,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error.");
    res.redirect("/");
  }
});

router.post("/add/:dreamId", async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash("warning", "You must be logged in to add favorites.");
      return res.redirect("/auth/login");
    }

    const user = await User.findById(req.session.user._id);
    const dream = await Dream.findById(req.params.dreamId);

    if (!dream) {
      req.flash("error", "Dream not found.");
      return res.redirect("/all_dreams");
    }

    if (dream.author && dream.author.toString() === user._id.toString()) {
      req.flash("success", "You cannot add your own dream to favorites.");
      return res.redirect("/favorites");
    }

    if (!user.favorites.includes(dream._id)) {
      user.favorites.push(dream._id);
      await user.save();
      req.flash("success", "Dream added to favorites!");
    }

    return res.redirect("/favorites");
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error.");
    return res.redirect("/all_dreams");
  }
});

router.post("/remove/:dreamId", async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash("warning", "You must be logged in to remove favorites.");
      return res.redirect("/auth/login");
    }

    const user = await User.findById(req.session.user._id);
    user.favorites = user.favorites.filter((id) => id.toString() !== req.params.dreamId);
    await user.save();

    req.flash("success", "Dream removed from favorites!");
    res.redirect("/favorites");
  } catch (error) {
    console.error(error);
    req.flash("danger", "Internal Server Error.");
    res.redirect("/favorites");
  }
});

module.exports = router;
