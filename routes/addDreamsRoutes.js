const { Router } = require("express");
const Dream = require("../models/dreams");

const router = new Router();

router.get("/", async (req, res) => {
  try {
    return res.render("add_new_dreams");
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
    });

    await newDream.save();

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
