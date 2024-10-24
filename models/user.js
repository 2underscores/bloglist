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
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id
    }
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User