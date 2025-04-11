const express = require("express");
const router = express.Router();
const User = require("../../models/users");
const Dream = require("../../models/dreams");
const multer = require("multer");
const path = require("path");
const { isAuthenticated } = require("../../middleware/auth");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user?._id;

    if (!userId) {
      return res.redirect("/auth/login");
    }

    const userFromDb = await User.findById(userId);
    const dreams = await Dream.find({ author: userId });

    res.render("profile/profile", {
      user: userFromDb,
      dreams,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error.");
    res.redirect("/");
  }
});

router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Dream.findOneAndDelete({ _id: req.params.id, author: req.session.user._id });
    req.flash("success", "Dream deleted successfully.");
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error.");
    res.redirect("/profile");
  }
});

router.get("/edit_dream/:id", isAuthenticated, async (req, res) => {
  try {
    const dream = await Dream.findOne({ _id: req.params.id, author: req.session.user._id });

    if (!dream) {
      req.flash("warning", "Dream not found.");
      return res.redirect("/profile");
    }

    res.render("dreams/editDream", {
      dream,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error.");
    res.redirect("/profile");
  }
});

router.post("/edit_dream/:id", isAuthenticated, async (req, res) => {
  try {
    await Dream.findOneAndUpdate(
      { _id: req.params.id, author: req.session.user._id },
      {
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
      }
    );

    req.flash("success", "Dream updated successfully.");
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error.");
    res.redirect("/profile");
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.session.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post("/edit", isAuthenticated, upload.single("avatar"), async (req, res) => {
  try {
    const { username, bio } = req.body;
    const updates = { username, bio };

    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    await User.findByIdAndUpdate(req.session.user._id, updates);

    req.flash("success", "Profile updated successfully.");
    return res.redirect("/profile");
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error.");
    return res.redirect("/profile");
  }
});

router.post("/delete_account", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/profile");
    }

    if (req.body.confirmUsername !== user.username) {
      req.flash("error", "Username does not match. Account not deleted.");
      return res.redirect("/profile");
    }

    // Зробити сни анонімними (або видалити, залежно від політики)
    await Dream.updateMany({ author: userId }, { $set: { author: null } });

    await User.findByIdAndDelete(userId);

    req.session.destroy(() => {
      res.redirect("/?accountDeleted=true");
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error.");
    res.redirect("/profile");
  }
});

module.exports = router;
