// routes/userroutes.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user'); // ✅ lowercase

// @desc Register new user
// @route POST /users/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "✅ User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "❌ Error registering user", error: err.message });
  }
});

// @desc Login user with Passport LocalStrategy
// @route POST /users/login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({ message: info?.message || "Login failed" });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        message: "✅ Login successful",
        user: { id: user._id, email: user.email, username: user.username }
      });
    });
  })(req, res, next);
});

// @desc Logout user
// @route GET /users/logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: "✅ Logged out successfully" });
  });
});

// @desc Protected profile route
// @route GET /users/profile
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  res.json({
    message: "✅ Welcome to your profile",
    user: req.user
  });
});

module.exports = router;
