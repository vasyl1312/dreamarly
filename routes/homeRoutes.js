const { Router } = require("express");
const router = new Router();

router.get("/", async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error.");
    res.redirect("/");
  }
});

module.exports = router;
