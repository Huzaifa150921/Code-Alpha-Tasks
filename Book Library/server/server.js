const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/book-library', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Book Schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  borrowed: { type: Boolean, default: false },
  history: [{ borrowedBy: String, borrowedAt: Date, returnedAt: Date }],
});

const Book = mongoose.model('Book', bookSchema);

// Routes

// Get all books with optional search and category filter
app.get('/books', async (req, res) => {
  const { search = '', category = '' } = req.query;
  const query = {
    title: { $regex: search, $options: 'i' },
    category: { $regex: category, $options: 'i' },
  };
  const books = await Book.find(query);
  res.json(books);
});
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new book
app.post('/books', async (req, res) => {
  const { title, author, category } = req.body;
  const book = new Book({ title, author, category });
  await book.save();
  res.json(book);
});

// Borrow a book
app.put('/books/:id/borrow', async (req, res) => {
  const { id } = req.params;
  const { borrowedBy } = req.body;
  if (!borrowedBy) return res.status(400).json({ message: 'Borrower name is required' });

  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (book.borrowed) return res.status(400).json({ message: 'Book already borrowed' });

  book.borrowed = true;
  book.history.push({ borrowedBy, borrowedAt: new Date() });
  await book.save();
  res.json(book);
});

app.put('/books/:id/return', async (req, res) => {
  const { id } = req.params;
  const { returnedBy } = req.body;
  if (!returnedBy) return res.status(400).json({ message: 'Borrower name is required' });

  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!book.borrowed) return res.status(400).json({ message: 'Book not borrowed' });

  book.borrowed = false;
  const historyEntry = book.history.find(entry => !entry.returnedAt && entry.borrowedBy === returnedBy);
  if (historyEntry) {
    historyEntry.returnedAt = new Date();
  }
  await book.save();
  res.json(book);
});

app.put('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, category } = req.body;
  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  book.title = title || book.title;
  book.author = author || book.author;
  book.category = category || book.category;
  await book.save();
  res.json(book);
});


app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Book.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: 'Book not found' });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/books', async (req, res) => {
  const { title, author, category } = req.body;
  if (!title || !author || !category) return res.status(400).json({ message: 'All fields are required' });
  
  const book = new Book({ title, author, category });
  await book.save();
  res.json(book);
});

// Start Server
app.listen(5000, () => console.log('Server running on port 5000'));
