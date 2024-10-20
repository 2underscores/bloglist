const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose') // App initializes mongo, but doesn't close it. Test close it.
const { db, testData: { blogsOne, blogsMany, blogsNone } } = require('./test_helper')

const api = supertest(app)
// TODO: Switch to a testing DB!
beforeEach(async () => {
  await db.reset(blogsMany)
})

describe('Listing notes', (() => {
  test('All notes are returned', async () => {
    const resp = await api
      .get('/api/blogs')
      .expect(200)
      .expect('content-type', /application\/json/)
    assert(resp.body.length === blogsMany.length)
  })

  test('Particular blog in DB'), async () => {
    const blog = blogsMany[0]
    const blogs = await api.get('/api/blogs')

  }
}))


after(async () => {
  await mongoose.connection.close()
  // If connection left open, process never end.
  // Can see in debugger the top "blog_api.test.js" process never ends so the test execution is never done.
  // stack is: test:watch: npm -> cross-env -> blog_api.test.js
})
