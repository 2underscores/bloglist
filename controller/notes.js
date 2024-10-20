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

noteRouter.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
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