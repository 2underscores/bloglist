const Blog = require('../models/note')

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

const clearData = async () => {
  return await Blog.deleteMany({})
}

const initData = async (blogs) => {
  return await Promise.all(
    blogs.map(b => Blog(b).save())
  )
}

const recurse = (n) => {
  if (n > 0) {
    const low = recurse(n - 1)
  }
  else {
    return n
  }
}

const setData = async (blogs) => {
  await clearData()
  return await initData(blogs)
}

module.exports = {
  testData: { blogsNone, blogsOne, blogsMany },
  db: {
    clear: clearData,
    set: initData,
    reset: setData
  }
}