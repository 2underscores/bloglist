const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose') // App initializes mongo, but doesn't close it. Test close it.

const api = supertest(app)

// TODO: Switch to a testing DB!
describe('CRUD on documents', (() => {
  test('Notes returned', async () => {
    const resp = await api
      .get('/api/blogs')
      .expect(200)
      .expect('content-type', /application\/json/)
    assert(resp.body.length > 10)
  })
}))

after(async () => {
  await mongoose.connection.close()
  // If connection left open, process never end.
  // Can see in debugger the top "blog_api.test.js" process never ends so the test execution is never done.
  // stack is: test:watch: npm -> cross-env -> blog_api.test.js
})
