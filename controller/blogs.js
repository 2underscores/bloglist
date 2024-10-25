const express = require('express')
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')

const blogRouter = express.Router()

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1 })
  logger.info(`Retrieved ${blogs.length} blogs`)
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findById(request.user.id) // Err if user not exist
  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  }
  const blog = new Blog(newBlog)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.put('/:id/likes', async (request, response) => {
  // Hmmmm, can't unlike
  const blog = await Blog.findById(request.params.id)
  blog.likes += 1
  const updatedBlog = await blog.save()
  response.status(200).json(updatedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    response.status(404).end()
    return
  }
  if (request.user.id !== blog.user.toString()) {
    response.status(401).json({ error: 'unauthorized' })
  } else {
    const res = await Blog.findByIdAndDelete(blog.id)
    const code = res ? 204 : 404
    response.status(code).end()
  }
})

// TODO: Blog.deleteMany({})

module.exports = blogRouter