const express = require("express");
const router = express.Router();
const Dream = require("../models/dreams");

router.get("/:id", async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream) {
      return res.status(404).send("The dream is not available");
    }
    return res.render("dream", { dream });
  } catch (error) {
    console.error(error);
    return res.status(500).send(" Internal error: " + error.message);
  }
});

router.post("/reaction/:dreamId", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { dreamId } = req.params;
  const { reaction } = req.body;
  const userId = req.session.user._id;

  try {
    const dream = await Dream.findById(dreamId);
    if (!dream) {
      return res.status(404).send("Dream not found");
    }

    if (!dream.reactions.hasOwnProperty(reaction)) {
      return res.status(400).send("Invalid reaction type");
    }

    // Перевіряємо, чи вже голосував користувач
    const previousReaction = dream.reactionUsers.get(userId);

    if (previousReaction) {
      if (previousReaction === reaction) {
        return res.redirect(`/dream/${dreamId}`); // Якщо вибрана та ж сама реакція, просто оновлюємо сторінку
      } else {
        // Видаляємо стару реакцію
        dream.reactions[previousReaction] -= 1;
      }
    }

    // Оновлюємо реакцію
    dream.reactionUsers.set(userId, reaction);
    dream.reactions[reaction] += 1;

    await dream.save();

    res.redirect(`/dream/${dreamId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
