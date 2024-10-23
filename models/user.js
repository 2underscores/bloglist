const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // unique: true,
    minlength: 3
  },
  passwordHash: {
    type: String,
    required: true
  },
  blogs: [{ // special mongoose syntax for list of other objects
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

const User = mongoose.model('User', userSchema)
module.exports = User