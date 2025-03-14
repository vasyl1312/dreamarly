const express = require("express");
const router = express.Router();
const Dream = require("../models/dreams");

router.get("/:id", async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream) {
      req.session.alert = { type: "danger", message: "The dream is not available" };
      return res.redirect("/all_dreams");
    }

    const alert = req.session.alert || { type: "", message: "" };
    req.session.alert = null;

    return res.render("dreams/dream", { dream, alert });
  } catch (error) {
    console.error(error);
    req.session.alert = { type: "danger", message: "Internal error: " + error.message };
    return res.redirect("/all_dreams");
  }
});

router.post("/reaction/:dreamId", async (req, res) => {
  if (!req.session.user) {
    req.session.alert = { type: "warning", message: "You need to log in to react!" };
    return res.redirect("/auth/login");
  }

  const { dreamId } = req.params;
  const { reaction } = req.body;
  const userId = req.session.user._id;

  try {
    const dream = await Dream.findById(dreamId);
    if (!dream) {
      req.session.alert = { type: "danger", message: "Dream not found" };
      return res.redirect("/all_dreams");
    }

    if (!dream.reactions.hasOwnProperty(reaction)) {
      req.session.alert = { type: "warning", message: "Invalid reaction type" };
      return res.redirect(`/dream/${dreamId}`);
    }

    const previousReaction = dream.reactionUsers.get(userId);

    if (previousReaction) {
      if (previousReaction === reaction) {
        req.session.alert = { type: "info", message: "You have already reacted with this" };
        return res.redirect(`/dream/${dreamId}`);
      } else {
        dream.reactions[previousReaction] -= 1;
      }
    }

    dream.reactionUsers.set(userId, reaction);
    dream.reactions[reaction] += 1;

    await dream.save();

    req.session.alert = { type: "success", message: "Your reaction was added!" };
    res.redirect(`/dream/${dreamId}`);
  } catch (error) {
    console.error(error);
    req.session.alert = { type: "danger", message: "Server error" };
    res.redirect("/all_dreams");
  }
});

module.exports = router;
