const mongoose = require('mongoose');

// Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] }
});

// Model
const Book = mongoose.model('Book', bookSchema);

module.exports = { Book }