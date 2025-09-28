const router = require('express').Router();
const passport = require('passport');

// Google OAuth login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.send("✅ Logged in with Google")
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => res.send("✅ Logged out"));
});

module.exports = router;
