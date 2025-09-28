const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Item = require('../models/item'); // your Item model
const { ensureAuth } = require('../middleware/auth');

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new item (protected + validation)
router.post('/',
  ensureAuth,
  [
    body('name').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('quantity').isInt({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const item = await Item.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT update item (protected + validation)
router.put('/:id',
  ensureAuth,
  [
    body('name').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('quantity').isInt({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: "Item not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE item (protected)
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


