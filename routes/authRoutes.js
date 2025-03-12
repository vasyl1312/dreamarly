const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const router = new Router();

let alert = { type: "", message: "" };

router.get("/register", (req, res) => {
  res.render("register", { alert });
  alert.type = "";
  alert.message = "";
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      alert.type = "danger";
      alert.message = "User already exists. Please login or use another email.";
      return res.redirect("/auth/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    alert.type = "success";
    alert.message = "Successfully registered. You can now log in!";
    return res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    alert.type = "danger";
    alert.message = "An error occurred. Please try again later.";
    return res.redirect("/auth/register");
  }
});

router.get("/login", (req, res) => {
  res.render("login", { alert, isLogin: true });
  alert.type = "";
  alert.message = "";
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({ email });
    if (!candidate) {
      alert.type = "danger";
      alert.message = "This email does not exist or the password is incorrect.";
      return res.redirect("/login");
    }

    const areSame = await bcrypt.compare(password, candidate.password);
    if (!areSame) {
      alert.type = "danger";
      alert.message = "Incorrect password. Please try again.";
      return res.redirect("/auth/login");
    }

    req.session.user = candidate;
    req.session.isAuthenticated = true;
    await req.session.save();

    alert.type = "info";
    alert.message = "You are now authenticated";
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    alert.type = "danger";
    alert.message = "An error occurred. Please try again later.";
    return res.redirect("/auth/login");
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
