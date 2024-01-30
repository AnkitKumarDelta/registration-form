const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/cognifyz');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
  },
  
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(plm);
module.exports = mongoose.model('User', userSchema);
