const express = require("express");
const router = express.Router();
const Dream = require("../models/dreams");

router.get("/", async (req, res) => {
  try {
    const dreams = await Dream.find();
    return res.render("allDreams", { dreams });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
