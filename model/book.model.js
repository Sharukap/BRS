const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  isbn: { type: String, required: false, unique:true },
  author: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Author'
  },
  bookshelf: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'category'
  },
  language:{type:String},
  published:{type:String},
  availability:{type:String}
}, { strict: false}
);


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;