const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

// Test data
const blogsNone = []
const blogsOne = [
  {
    title: 'title 1',
    author: 'author 1',
    url: 'url 1',
    likes: 1,
  }]
const blogsMany = [
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

const userOne = {
  username: `blogTesUser${crypto.randomBytes(2).toString('hex')}`,
  password: `testpassword1233`,
}

const clearData = async () => {
  const userDelete = await User.deleteMany({})
  const blogDelete = await Blog.deleteMany({})
  return { userDelete, blogDelete }
}

const initData = async (blogs) => {
  // User to link blogs to
  const userSaved = await User({
    username: userOne.username,
    passwordHash: await bcrypt.hash(userOne.password, 1)
  }).save()
  // Blogs
  const blogsSaved = await Promise.all(
    blogs.map(b => Blog({ ...b, ...{ user: userSaved.id } }).save())
  )
  // Link blogs in user
  const blogIds = blogsSaved.map(b => b.id)
  userSaved.blogs = userSaved.blogs.concat(blogIds) // Concat unnecessary but whatever
  const userResaved = await userSaved.save()
  return { userResaved, blogsSaved }
}

const resetData = async (blogs) => {
  await clearData()
  const data = await initData(blogs)
  return data
}

const getData = async () => {
  return await Blog.find({})
}

module.exports = {
  testData: { blogsNone, blogsOne, blogsMany },
  db: {
    clear: clearData,
    set: initData,
    reset: resetData,
    get: getData
  }
}