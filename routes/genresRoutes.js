const express = require("express");
const router = express.Router();
const Dream = require("../models/dreams");

router.get("/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const dreams = await Dream.find({ categories: category }).populate("author");
    res.render("genres/genre", {
      category,
      dreams,
      user: req.user,
      alert: req.session.alert || { type: "", message: "" },
    });

    req.session.alert = null;
  } catch (error) {
    console.error(error);
    req.session.alert = { type: "danger", message: "Internal Server Error." };
    res.redirect("/");
  }
});

module.exports = router;
