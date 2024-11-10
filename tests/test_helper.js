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
    username: 'uuu',
    name: 'Jez Smith',
    password: 'ppp',
  }, {
    username: 'TestUser2',
    name: "Lizzy Atkinson",
    password: 'password2',
  }, {
    username: 'TestUser3',
    name: 'Milly Winks',
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
  const unique = crypto.randomBytes(4).toString('hex')
  const template = {
    _id: generateMockMongoId(),
    passwordHash: (await generatePasswordHash()).hash,
    username: `TestUser${unique}`,
    name: `Borris ${unique}`,
  }
  return { ...template, ...partialUserObject }
}

// Users
const injectUser = async (testUser) => {
  const userSaved = await User({
    username: testUser.username,
    name: testUser.name,
    passwordHash: (await generatePasswordHash(testUser.password)).hash,
  }).save()
  return userSaved
}
const injectUsers = async (testUsers) => {
  const usersSaved = await Promise.all(
    testUsers.map(u => injectUser(u))
  )
  return usersSaved
}

// Blogs
const injectBlog = async (testblog) => {
  const blogSaved = await Blog({
    ...testblog,
    ...{ user: generateMockMongoId() },
  }).save()
  return blogSaved
}
const injectBlogs = async (testBlogs) => {
  const blogsSaved = await Promise.all(
    testBlogs.map(b => injectBlog(b))
  )
  return blogsSaved
}

const attachBlogsToUser = async (blogs, user) => {
  // Two write to DB so can't same single attach blog or faile
  const blogsAttached = await Promise.all(
    blogs.map(b => {
      b.user = user.id
      return b.save()
    }))
  user.blogs = user.blogs.concat(blogs.map(b => b.id))
  const userSaved = await user.save()
  return { user: userSaved, blogs: blogsAttached }
}

const getAllBlogs = async () => {
  return await Blog.find({})
}

const getAllUsers = async () => {
  return await User.find({})
}

const clearData = async () => {
  const userDelete = await User.deleteMany({})
  const blogDelete = await Blog.deleteMany({})
  return { userDelete, blogDelete }
}

module.exports = {
  testBlogs,
  testUsers,
  injectBlogs,
  injectUsers,
  attachBlogsToUser,
  getAllBlogs,
  getAllUsers,
  clearData,
  generateMockUser,
}