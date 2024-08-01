const express = require('express');
const router = express.Router();
const Book = require('../modals/book');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new book
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    category: req.body.category,
    borrowedBy: req.body.borrowedBy,
    borrowDate: req.body.borrowDate,
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (req.body.title) book.title = req.body.title;
    if (req.body.author) book.author = req.body.author;
    if (req.body.category) book.category = req.body.category;
    if (req.body.borrowedBy) book.borrowedBy = req.body.borrowedBy;
    if (req.body.borrowDate) book.borrowDate = req.body.borrowDate;
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    await book.remove();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
