const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [{ // special mongoose syntax for list of other objects
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.passwordHash
    }
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User