const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { testBlogs } = require('./test_helper')



// TODO: Add list with a non-blog object? More a TS thing.... Pass undefined or some other object
describe('Able sum all likes in blogs', () => {
  test('No blogs', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })
  test('One blog', () => {
    assert.strictEqual(listHelper.totalLikes([testBlogs[0]]), [testBlogs[0]][0].likes)
  })
  test('Many blogs', () => {
    assert.strictEqual(listHelper.totalLikes(testBlogs), 12)
  })
})

describe('Able to find favorite blog', () => {
  test('No blogs is undefined', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), undefined)
  })
  test('One blog', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([testBlogs[0]]), [testBlogs[0]][0])
  })
  test('Many blogs', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(testBlogs), testBlogs[3])
  })
})

describe('Able to find author with most blogs', () => {
  test('No blogs is undefined', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), undefined)
  })
  test('One blog', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([testBlogs[0]]), { 'author': [testBlogs[0]][0].author, 'blogs': 1 })
  })
  test('Many blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(testBlogs), { 'author': 'author 2', 'blogs': 2 })
  })
})

describe('Most liked author', () => {
  test('No blogs is undefined', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), undefined)
  })
  test('One blog', () => {
    assert.deepStrictEqual(listHelper.mostLikes([testBlogs[0]]), { 'author': [testBlogs[0]][0].author, 'likes': [testBlogs[0]][0].likes })
  })
  test('Many blogs', () => {
    assert.deepStrictEqual(listHelper.mostLikes(testBlogs), { 'author': 'author 2', 'likes': 5 })
  })
})
