const express = require('express')
const Blog = require('../models/note')
const logger = require('../utils/logger')

const noteRouter = express.Router()

noteRouter.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      logger.info(`Retrieved ${blogs.length} blogs`)
      response.json(blogs)
    })
})

noteRouter.get('/api/blogs/:id', (request, response) => {
  Blog
    .findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(e => {
      if (e.message.startsWith('Cast to ObjectId failed')) {
        response.status(404).end()
      } else { throw e }
    })
})

noteRouter.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(e => {
      if (e.message.startsWith('Blog validation failed')) {
        response.status(400).send(e.message)
      }
    })
})

noteRouter.put('/api/blogs/:id/likes', async (request, response) => {
  // Hmmmm, can't unlike
  const blog = await Blog.findById(request.params.id)
  blog.likes += 1
  const updatedBlog = await blog.save()
  response.status(200).json(updatedBlog)
})

noteRouter.delete('/api/blogs/:id', (request, response) => {
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

module.exports = noteRouter