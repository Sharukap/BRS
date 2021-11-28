const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({

  reviewTitle: { type: String, required: true },
  reviewBody: { type: String, required: true },
  rating: {type: Number, required: true}
  
}, { timestamps: true }
);


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;