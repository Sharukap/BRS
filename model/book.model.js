const mongoose = require('mongoose');
const Review = require('./review.model');
const Category = require('./category.model');
const Schema = mongoose.Schema;

//Individual contribution of  185016T Collure K.S 
const reviewSchema = new Schema({

  reviewTitle: { type: String, required: true },
  reviewBody: { type: String, required: true },
  rating: {type: Number, required: true}
  
}, { timestamps: true }
);


//Individual contribution of  185052A Perera G.S.N.
const bookSchema = new Schema({
  title: { type: String, required: true },
  isbn: { type: String, required: false, unique:true },
  author: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Author'
  },
  bookshelf: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category'
  },
  language:{type:String},
  published:{type:String},
  library:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Library'
  },
  availability:{type:String},
  review:[reviewSchema] //-- THE REVIEW SCHEMA WAS nested within Book Schema for efficiency

}, { strict: false}
);

const Book = mongoose.model('Book', bookSchema); 

module.exports = Book;