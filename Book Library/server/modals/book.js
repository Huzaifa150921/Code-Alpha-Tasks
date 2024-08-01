// server/models/Book.js

const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  borrowed: { type: Boolean, default: false },
  history: [{ borrowedBy: String, borrowedAt: Date, returnedAt: Date }],
});

module.exports = mongoose.model('Book', bookSchema);
