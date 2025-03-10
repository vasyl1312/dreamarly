const { Router } = require("express");
// const AboutUs = require("../models/aboutUs");
// const Contacts = require("../models/contacts");
// const Gallery = require("../models/gallery");
const router = new Router();

router.get("/", async (req, res) => {
  try {
    // const contact = await Contacts.findOne();
    // const aboutUs = await AboutUs.find();
    // const gallery = await Gallery.find().sort({ date: -1 });

    // if (!contact) {
    //   return res.status(404).send("Контакт не знайдено");
    // }

    // if (!aboutUs) {
    //   return res.status(404).send("Інформацію в блоку про нас не знайдено");
    // }

    // res.render("index", { contact, aboutUs, gallery });
    res.render("index");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
