const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Dream = require("../models/dreams");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const user = req.session.user;
    const dreams = await Dream.find({ author: user._id });

    res.render("profile", { user, dreams, alert: req.session.alert || { type: "", message: "" } });

    req.session.alert = null;
  } catch (error) {
    console.error(error);
    req.session.alert = { type: "danger", message: "Internal Server Error." };
    res.redirect("/");
  }
});

router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Dream.findOneAndDelete({ _id: req.params.id, author: req.session.user._id });
    req.session.alert = { type: "success", message: "Dream deleted successfully." };
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    req.session.alert = { type: "danger", message: "Internal Server Error." };
    res.redirect("/profile");
  }
});

router.get("/edit_dream/:id", isAuthenticated, async (req, res) => {
  try {
    const dream = await Dream.findOne({ _id: req.params.id, author: req.session.user._id });

    if (!dream) {
      req.session.alert = { type: "warning", message: "Dream not found." };
      return res.redirect("/profile");
    }

    res.render("editDream", { dream, alert: req.session.alert || {} });
    req.session.alert = null;
  } catch (error) {
    console.error(error);
    req.session.alert = { type: "danger", message: "Internal Server Error." };
    res.redirect("/profile");
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

    req.session.alert = { type: "success", message: "Dream updated successfully." };
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    req.session.alert = { type: "danger", message: "Internal Server Error." };
    res.redirect("/profile");
  }
});

router.get("/favorites", async (req, res) => {
  try {
    if (!req.session.user) {
      req.session.alert = { type: "danger", message: "You must be logged in to view favorites." };
      return res.redirect("/auth/login");
    }

    const user = await User.findById(req.session.user._id).populate("favorites");
    res.render("favorites", { favorites: user.favorites, alert: req.session.alert || {} });

    req.session.alert = null;
  } catch (error) {
    console.error(error);
    req.session.alert = { type: "danger", message: "Internal Server Error." };
    res.redirect("/");
  }
});

module.exports = router;
