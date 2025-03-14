const { Router } = require("express");
const Dream = require("../models/dreams");

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const alert = req.session.alert || { type: "", message: "" };
    req.session.alert = null;
    res.render("addNewDreams", { alert });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const newDream = new Dream({
      title: req.body.title,
      description: req.body.description,
      categories: req.body.categories,
      date: new Date(),
      author: req.session.user ? req.session.user._id : null,
    });

    await newDream.save();

    req.session.alert = { type: "success", message: "Successfully added new dream!" };
    res.redirect("/all_dreams");
  } catch (error) {
    console.error(error);
    req.session.alert = { type: "danger", message: "Something went wrong. Please try again." };
    res.redirect("/add_new_dreams");
  }
});

module.exports = router;
