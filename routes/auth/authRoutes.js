const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../../models/users");
const router = new Router();
const defaultAvatar = "/uploads/avatars/default.png";

router.get("/register", (req, res) => {
  const alert = req.session.alert || { type: "", message: "" };
  req.session.alert = null;
  res.render("auth/register", { alert });
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.session.alert = {
        type: "danger",
        message: "User already exists. Please login or use another email.",
      };
      return res.redirect("/auth/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      avatar: defaultAvatar,
      bio: "",
    });
    await newUser.save();

    req.session.alert = {
      type: "success",
      message: "Successfully registered. You can now log in!",
    };
    return res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    req.session.alert = {
      type: "danger",
      message: "An error occurred. Please try again later.",
    };
    return res.redirect("/auth/register");
  }
});

router.get("/login", (req, res) => {
  const alert = req.session.alert || { type: "", message: "" };
  req.session.alert = null;
  res.render("auth/login", { alert, isLogin: true });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({ email });
    if (!candidate) {
      req.session.alert = {
        type: "danger",
        message: "This email does not exist or the password is incorrect.",
      };
      return res.redirect("/auth/login");
    }

    const areSame = await bcrypt.compare(password, candidate.password);
    if (!areSame) {
      req.session.alert = {
        type: "danger",
        message: "Incorrect password. Please try again.",
      };
      return res.redirect("/auth/login");
    }

    req.session.user = candidate;
    req.session.isAuthenticated = true;
    await req.session.save();

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    req.session.alert = {
      type: "danger",
      message: "An error occurred. Please try again later.",
    };
    return res.redirect("/auth/login");
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
