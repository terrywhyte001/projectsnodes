// routes/userroutes.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/user'); 
const { ensureAuth } = require('../middleware/auth');

// @desc Register new user
// @route POST /users/register
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: 'user'
      });

      await newUser.save();
      res.status(201).json({ message: '✅ User registered successfully' });
    } catch (err) {
      res.status(500).json({ message: '❌ Error registering user', error: err.message });
    }
  }
);

// @desc Login user
// @route POST /users/login
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      res.json({ message: '✅ Login successful', user: { id: user._id, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: '❌ Error logging in', error: err.message });
    }
  }
);

// @desc Update user
// @route PUT /users/:id
router.put(
  '/:id',
  ensureAuth,
  [
    body('username').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updates = { ...req.body };
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });

      res.json({ message: '✅ User updated', user: updatedUser });
    } catch (err) {
      res.status(500).json({ message: '❌ Error updating user', error: err.message });
    }
  }
);

// @desc Delete user
// @route DELETE /users/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: '✅ User deleted' });
  } catch (err) {
    res.status(500).json({ message: '❌ Error deleting user', error: err.message });
  }
});

module.exports = router;
