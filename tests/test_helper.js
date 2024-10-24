const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

// Test data
const testBlogs = [
  {
    title: 'title 1',
    author: 'author 1',
    url: 'url 1',
    likes: 3,
  }, {
    title: 'title 2',
    author: 'author 2', // Most liked author, most blogged author
    url: 'url 2',
    likes: 2,
  }, {
    title: 'title 3',
    author: 'author 2',
    url: 'url 3',
    likes: 3,
  }, {
    title: 'title 4',
    author: 'author 3',
    url: 'url 4',
    likes: 4, // Most liked blog
  }
]

const testUsers = [
  {
    username: 'TestUser1',
    password: 'password1',
  }, {
    username: 'TestUser2',
    password: 'password2',
  }, {
    username: 'TestUser3',
    password: 'password3',
  }
]

const generatePasswordHash = async (password = undefined, saltRounds = 1) => {
  password = password ? password : crypto.randomBytes(16).toString('hex')
  const hash = await bcrypt.hash(password, saltRounds)
  return { password, hash }
}

const generateMockMongoId = () => {
  return crypto.randomBytes(12).toString('hex')
}

const generateMockUser = async (partialUserObject) => {
  const template = {
    _id: generateMockMongoId(),
    passwordHash: (await generatePasswordHash()).hash,
    username: crypto.randomBytes(4).toString('hex'),
  }
  return { ...template, ...partialUserObject }
}

const injectUser = async (testUser) => {
  const userSaved = await User({
    username: testUser.username,
    passwordHash: (await generatePasswordHash()).hash,
  }).save()
  return userSaved
}

const injectBlog = async (testblog) => {
  const blogSaved = await Blog({
    ...testblog,
    ...{ user: generateMockMongoId() },
  }).save()
  return blogSaved
}

const attachBlogToUser = async (user, blog) => {
  blog.user = user.id
  const blogSaved = blog.save()
  user.blogs = user.blogs.concat(blog.id)
  const userSaved = user.save()
  return { user: userSaved, blog: blogSaved }
}

const injectManyBlogs = async (testBlogs) => {
  const blogsSaved = await Promise.all(
    testBlogs.map(b => injectBlog(b))
  )
  return blogsSaved
}

const injectManyUsers = async (testUsers) => {
  const usersSaved = await Promise.all(
    testUsers.map(u => injectUser(u))
  )
  return usersSaved
}

const getAllBlogs = async () => {
  return await Blog.find({})
}

const getAllUsers = async () => {
  return await Blog.find({})
}

const clearData = async () => {
  const userDelete = await User.deleteMany({})
  const blogDelete = await Blog.deleteMany({})
  return { userDelete, blogDelete }
}

module.exports = {
  testBlogs,
  testUsers,
  injectBlog,
  injectManyBlogs,
  injectUser,
  injectManyUsers,
  attachBlogToUser,
  getAllBlogs,
  getAllUsers,
  clearData,
}