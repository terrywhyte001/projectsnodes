const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  inStock: { type: Boolean, default: true }
}, { timestamps: true }); // automatically adds createdAt and updatedAt

module.exports = mongoose.model('Item', itemSchema);
