const express = require("express");
const router = express.Router();
const Dream = require("../../models/dreams");
const Comment = require("../../models/comments");
const base_url = process.env.BASE_URL_PORT;

router.get("/:id", async (req, res) => {
  try {
    const dreamId = req.params.id;
    const dream = await Dream.findById(dreamId).populate("author");
    if (!dream) {
      req.flash("error", "The dream is not available");
      return res.redirect("/all_dreams");
    }

    // Отримати коментарі до цього сну, включаючи авторів
    const comments = await Comment.find({ dream: dreamId, parentComment: null })
      .populate("author")
      .populate({
        path: "replies",
        populate: { path: "author" },
      })
      .sort({ createdAt: -1 });

    const now = Date.now();
    const viewCooldown = 5 * 60 * 1000; // 5 хвилин

    if (!req.session.dreamViews) {
      req.session.dreamViews = {};
    }

    const lastViewTime = req.session.dreamViews[dreamId];

    if (!lastViewTime || now - lastViewTime > viewCooldown) {
      dream.views += 1;
      await dream.save();
      req.session.dreamViews[dreamId] = now;
    }

    return res.render("dreams/dream", {
      dream,
      base_url,
      comments,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal error: " + error.message);
    return res.redirect("/all_dreams");
  }
});

router.post("/reaction/:dreamId", async (req, res) => {
  if (!req.session.user) {
    req.flash("warning", "You need to log in to react!");
    return res.redirect("/auth/login");
  }

  const { dreamId } = req.params;
  const { reaction } = req.body;
  const userId = req.session.user._id;

  try {
    const dream = await Dream.findById(dreamId);
    if (!dream) {
      req.flash("error", "Dream not found");
      return res.redirect("/all_dreams");
    }

    if (!dream.reactions.hasOwnProperty(reaction)) {
      req.flash("warning", "Invalid reaction type");
      return res.redirect(`/dream/${dreamId}`);
    }

    const previousReaction = dream.reactionUsers.get(userId);

    if (previousReaction) {
      if (previousReaction === reaction) {
        req.flash("info", "You have already reacted with this");
        return res.redirect(`/dream/${dreamId}`);
      } else {
        dream.reactions[previousReaction] -= 1;
      }
    }

    dream.reactionUsers.set(userId, reaction);
    dream.reactions[reaction] += 1;

    await dream.save();

    req.flash("success", "Your reaction was added!");
    res.redirect(`/dream/${dreamId}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Server error");
    res.redirect("/all_dreams");
  }
});

module.exports = router;
