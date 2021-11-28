const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const librarySchema = new Schema({
  libName: { type: String, required: true },
  address: { type: String, required: true },
  associatedInstitute: { type: String, required: true },
  librarianName: { type: String, required: true },
  numberofStaff: {type: Number, required: true}
}, {strict:false});

const Library = mongoose.model("Library", librarySchema);

module.exports = Library;
