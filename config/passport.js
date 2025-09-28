const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
  // Configure local strategy to use "email" instead of default "username"
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() }); // normalize email
        if (!user) {
          return done(null, false, { message: 'No user found with that email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, user);
      } catch (err) {
        console.error('Error in Passport strategy:', err);
        return done(err);
      }
    })
  );

  // Save only user id in session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Restore user from id stored in session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
