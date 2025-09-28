// middleware/auth.js

/**
 * Middleware to protect routes that require authentication.
 * Uses Passport's req.isAuthenticated() to check if the user is logged in.
 */

module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      // User is authenticated, proceed to the route
      return next();
    }
    // User is not authenticated, return 401 Unauthorized
    return res.status(401).json({ error: "Unauthorized: Login required" });
  }
};
