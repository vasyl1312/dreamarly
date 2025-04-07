const express = require("express");
const router = express.Router();
const Dream = require("../../models/dreams");

router.get("/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const sortOption = req.query.sort || "top";

    let dreams;

    if (sortOption === "latest") {
      dreams = await Dream.find({ categories: category }).populate("author").sort({ date: -1 });
    } else if (["very_cool", "pleasant", "funny", "mind_blown", "weird"].includes(sortOption)) {
      const sortKey = `reactions.${sortOption}`;
      dreams = await Dream.find({ categories: category })
        .populate("author")
        .sort({ [sortKey]: -1, date: -1 });
    } else {
      dreams = await Dream.aggregate([
        { $match: { categories: category } },
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

      dreams = await Dream.populate(dreams, { path: "author" });
    }

    res.render("genres/genre", {
      category,
      dreams,
      user: req.user,
      sort: sortOption,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error.");
    res.redirect("/");
  }
});

module.exports = router;
