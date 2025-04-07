const express = require("express");
const router = express.Router();
const User = require("../../models/users");
const Dream = require("../../models/dreams");

router.get("/:id", async (req, res) => {
  try {
    const author = await User.findById(req.params.id);
    if (!author) return res.status(404).send("Author not found");

    const dreams = await Dream.find({ author: author._id }).sort({ date: -1 });

    return res.render("authors/author", { author, dreams });
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error.");
    return res.redirect("/");
  }
});

module.exports = router;
