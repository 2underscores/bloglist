const express = require('express')
const Blog = require('../models/blog')
const logger = require('../utils/logger')

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
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

blogRouter.put('/api/blogs/:id/likes', async (request, response) => {
  // Hmmmm, can't unlike
  const blog = await Blog.findById(request.params.id)
  blog.likes += 1
  const updatedBlog = await blog.save()
  response.status(200).json(updatedBlog)
})

blogRouter.delete('/api/blogs/:id', (request, response) => {
  Blog.findByIdAndDelete(request.params.id)
    .then((results) => {
      logger.info('Deleted:', results)
      if (results) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
})

// TODO: Blog.deleteMany({})

module.exports = blogRouter