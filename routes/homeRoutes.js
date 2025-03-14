const { Router } = require("express");

const router = new Router();

router.get("/", async (req, res) => {
  try {
    res.render("index", { alert: req.session.alert || { type: "", message: "" } });

    req.session.alert = null;
  } catch (error) {
    console.error(error);
    req.session.alert = { type: "danger", message: "Internal Server Error." };
    res.redirect("/");
  }
});

module.exports = router;
