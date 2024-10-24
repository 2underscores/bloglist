const mongoose = require('mongoose')

// TODO: Schema validation
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: false,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
    }
  }
}
)

// TODO: toJSON strip __v, _id->id
const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog
