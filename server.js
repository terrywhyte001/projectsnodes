// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// -------------------------
// Connect to MongoDB
// -------------------------
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// -------------------------
// Routes
// -------------------------
app.use('/items', itemRoutes);
app.use('/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// -------------------------
// Start server
// -------------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
