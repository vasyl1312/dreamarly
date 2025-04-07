const express = require("express");
const router = express.Router();
const Dream = require("../../models/dreams");

router.get("/", async (req, res) => {
  try {
    const sortOption = req.query.sort || "top";
    let dreams;

    if (sortOption === "latest") {
      dreams = await Dream.find().sort({ date: -1 });
    } else if (["very_cool", "pleasant", "funny", "mind_blown", "weird"].includes(sortOption)) {
      const sortKey = `reactions.${sortOption}`;
      dreams = await Dream.find().sort({ [sortKey]: -1, date: -1 });
    } else {
      dreams = await Dream.aggregate([
        {
          $addFields: {
            reactionCount: {
              $add: [
                "$reactions.very_cool",
                "$reactions.pleasant",
                "$reactions.funny",
                "$reactions.mind_blown",
                "$reactions.weird",
              ],
            },
          },
        },
        { $sort: { reactionCount: -1, date: -1 } },
      ]);
    }

    const alert = req.session.alert || { type: "", message: "" };
    req.session.alert = null;

    res.render("dreams/allDreams", { dreams, alert, sort: sortOption });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
