const Item = require('../models/item');

// CREATE
exports.createItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Item not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found.' });
    res.json({ message: 'Item deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};