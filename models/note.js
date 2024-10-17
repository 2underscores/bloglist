const mongoose = require('mongoose')

// TODO: Schema validation
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

// TODO: toJSON strip __v, _id->id

module.exports = mongoose.model('Blog', blogSchema)