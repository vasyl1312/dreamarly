const express = require("express");
const router = express.Router();
const Dream = require("../models/dreams");

router.get("/", async (req, res) => {
  try {
    const dreams = await Dream.find().sort({ date: -1 });

    const alert = req.session.alert || { type: "", message: "" };
    req.session.alert = null;

    res.render("allDreams", { dreams, alert });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
