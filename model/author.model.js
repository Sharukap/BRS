const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: { type: String, required: true },
  genreSpec: { type: String, required: true },
  authorDesc: { type: String, required: true },
  nationality: { type: String, required: true }
},{strict: false}
);


const Author = mongoose.model('Author', authorSchema);

module.exports = Author;