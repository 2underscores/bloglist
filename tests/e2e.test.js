const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose') // App initializes mongo, but doesn't close it. Test close it.
const helper = require('./test_helper')

const api = supertest(app)
//: Switch to a testing DB!
let user, blogs // Bad pattern, tests clobber each other, can't un in parallel

beforeEach(async () => {
  await helper.clearData()
  user = (await helper.injectUsers([helper.testUsers[0]]))[0]
  blogs = await helper.injectBlogs(helper.testBlogs)
  const attached = await helper.attachBlogsToUser(blogs, user);
  ({ user, blogs } = attached)
})

describe('Creating a user, attaching blog', () => {
  test('Attach blogs user, check user', async () => {
    // TODO: signup, login, create blog.
    const beforeUsersResp = await api.get('/api/users/').expect(200)
    const beforeUser = beforeUsersResp.body[0]
    const blogCreateResp = await api.post('/api/blogs').send({
      ...helper.testBlogs[0],
      ...{ user: beforeUser._id }
    }).expect(201)
    const blogId = blogCreateResp.body.id
    const afterUsersResp = await api.get('/api/users/').expect(200)
    const afterUser = afterUsersResp.body.find(u => u._id === beforeUser._id)
    assert.strictEqual(beforeUser._id, afterUser._id)
    assert.strictEqual(beforeUser.blogs.length + 1, afterUser.blogs.length)
    assert(afterUser.blogs.map(b => b.id).includes(blogId))
    assert.strictEqual(afterUser.blogs.find(b => b.id === blogId).author, helper.testBlogs[0].author)
  })
})

after(async () => {
  await mongoose.connection.close()
  // If connection left open, process never end.
  // Can see in debugger the top "blog_api.test.js" process never ends so the test execution is never done.
  // stack is: test:watch: npm -> cross-env -> blog_api.test.js
})