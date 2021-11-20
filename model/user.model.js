const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
}, { strict: false}
);

//password hashing
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};
userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password,this.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User;