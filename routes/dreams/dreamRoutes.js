const express = require("express");
const router = express.Router();
const Dream = require("../../models/dreams");
const base_url = process.env.BASE_URL_PORT;

router.get("/:id", async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream) {
      req.flash("error", "The dream is not available");
      return res.redirect("/all_dreams");
    }

    return res.render("dreams/dream", { dream, alert, base_url });
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
