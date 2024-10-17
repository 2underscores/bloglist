const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

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
// TODO: Add list with a non-note object? More a TS thing.... Pass undefined or some other object

describe('Able sum all likes in blogs', () => {
  test('No blogs', () => {
    assert.strictEqual(listHelper.totalLikes(blogsNone), 0)
  })
  test('One blog', () => {
    assert.strictEqual(listHelper.totalLikes(blogsOne), blogsOne[0].likes)
  })
  test('Many blogs', () => {
    assert.strictEqual(listHelper.totalLikes(blogsMany), 12)
  })
})

describe('Able to find favorite blog', () => {
  test('No blogs is undefined', () => {
    assert.strictEqual(listHelper.favoriteBlog(blogsNone), undefined)
  })
  test('One blog', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogsOne), blogsOne[0])
  })
  test('Many blogs', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogsMany), blogsMany[3])
  })
})

describe('Able to find author with most blogs', () => {
  test('No blogs is undefined', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogsNone), undefined)
  })
  test('One blog', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogsOne), { 'author': blogsOne[0].author, 'blogs': 1 })
  })
  test('Many blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogsMany), { 'author': 'author 2', 'blogs': 2 })
  })
})

describe('Most liked author', () => {
  test('No blogs is undefined', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogsNone), undefined)
  })
  test('One blog', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogsOne), { 'author': blogsOne[0].author, 'likes': blogsOne[0].likes })
  })
  test('Many blogs', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogsMany), { 'author': 'author 2', 'likes': 5 })
  })
})
