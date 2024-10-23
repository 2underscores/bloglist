const express = require('express')
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')

const blogRouter = express.Router()

blogRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  logger.info(`Retrieved ${blogs.length} blogs`)
  response.json(blogs)
})

blogRouter.get('/api/blogs/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/api/blogs', async (request, response) => {
  const body = request.body
  const user = await User.findById(body.userId) // Err if user not exist
  const blog = new Blog(body) // Might need more explicit mapping (PURE Crud atm)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  response.status(201).json(savedBlog)
})

blogRouter.put('/api/blogs/:id/likes', async (request, response) => {
  // Hmmmm, can't unlike
  const blog = await Blog.findById(request.params.id)
  blog.likes += 1
  const updatedBlog = await blog.save()
  response.status(200).json(updatedBlog)
})

blogRouter.delete('/api/blogs/:id', async (request, response) => {
  const res = await Blog.findByIdAndDelete(request.params.id)
  const code = res ? 204 : 404
  response.status(code).end()
})

// TODO: Blog.deleteMany({})

module.exports = blogRouter