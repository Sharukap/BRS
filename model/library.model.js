const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const librarySchema = new Schema({
  name: { type: String, required: true },
  
}
);


const Library = mongoose.model('Library', librarySchema);

module.exports = Library;