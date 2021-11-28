const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publisherSchema = new Schema({
 
  regNo:{ type: Number, required: true, unique: true  },
  name: { type: String, required: true },
  location: {type: String},
  contactNo: {type: String}
},
);


const Publisher = mongoose.model('Publisher', publisherSchema);

module.exports = Publisher;