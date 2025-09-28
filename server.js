require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemroutes'); // exact casing
const userRoutes = require('./routes/userRoutes'); // exact casing
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('passport');
const session = require('express-session');
require('./config/passport')(passport);

const app = express();
app.use(express.json());

// Session + Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/items', itemRoutes);
app.use('/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // for testing

