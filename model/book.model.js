const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: { type: String, required: true }
}, { strict: false}
);


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;