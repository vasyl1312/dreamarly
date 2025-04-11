const express = require("express");
const router = express.Router();
const Comment = require("../../models/comments");
const Dream = require("../../models/dreams");
const { isAuthenticated } = require("../../middleware/auth");

router.post("/:dreamId", isAuthenticated, async (req, res) => {
  try {
    const { content } = req.body;
    const dreamId = req.params.dreamId;

    if (!content || content.trim() === "") {
      req.flash("error", "Comment cannot be empty.");
      return res.redirect("/dream/" + dreamId);
    }

    await Comment.create({
      dream: dreamId,
      author: req.session.user._id,
      content,
    });

    req.flash("success", "Comment added successfully.");
    res.redirect("/dream/" + dreamId);
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to add comment.");
    res.redirect("/dream/" + req.params.dreamId);
  }
});

module.exports = router;
