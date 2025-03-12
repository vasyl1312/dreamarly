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

router.post("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;

    await Dream.findByIdAndDelete(id);
    return res.redirect("/all_dreams");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
