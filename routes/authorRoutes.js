const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Dream = require("../models/dreams");

router.get("/:id", async (req, res) => {
  try {
    const author = await User.findById(req.params.id);
    if (!author) return res.status(404).send("Author not found");

    const dreams = await Dream.find({ author: author._id }).sort({ date: -1 });

    const alert = req.session.alert || { type: "", message: "" };
    req.session.alert = null;

    return res.render("authors/author", { author, dreams, alert });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
