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

module.exports = router;
