const { test, describe, after } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose') // App initialises mongo, but doesn't close it. Test close it.

const api = supertest(app)

// TODO: Switch to a testing DB!
describe('CRUD on documents', (() => {
  test('Notes returned', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('content-type', /application\/json/)
  })
}))

after(async () => {
  await mongoose.connection.close()
})
