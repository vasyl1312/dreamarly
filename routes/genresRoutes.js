const express = require("express");
const router = express.Router();
const Dream = require("../models/dreams");

router.get("/:category", async (req, res) => {
  const category = req.params.category;
  const dreams = await Dream.find({ categories: category }).populate("author");
  res.render("genre", { category, dreams, user: req.user });
});

module.exports = router;
