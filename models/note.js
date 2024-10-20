const mongoose = require('mongoose')

// TODO: Schema validation
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

// TODO: toJSON strip __v, _id->id
const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog