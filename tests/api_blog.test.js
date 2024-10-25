const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose') // App initializes mongo, but doesn't close it. Test close it.
const helper = require('./test_helper')
const auth = require('../utils/auth')

const api = supertest(app)
//: Switch to a testing DB!
let user, token, blogs // Bad pattern, tests clobber each other, can't un in parallel

beforeEach(async () => {
  await helper.clearData()
  user = (await helper.injectUsers([helper.testUsers[0]]))[0]
  token = auth.generateToken(user)
  blogs = await helper.injectBlogs(helper.testBlogs)
  const attached = await helper.attachBlogsToUser(blogs, user);
  ({ user, blogs } = attached)
})

describe('Listing blogs', (() => {

  test('Particular blog in listed blogs', async () => {
    const blog = helper.testBlogs[0]
    const blogsResp = await api
      .get('/api/blogs')
      .set('authorization', `Bearer ${token}`)
      .expect(200)
    assert(blogsResp.body.map(b => b.url).includes(blog.url))
  })

  test('Returned blog metadata is stripped', async () => {
    const blogsResp = await api
      .get('/api/blogs')
      .set('authorization', `Bearer ${token}`)
      .expect(200)
    const blog = blogsResp.body[0]
    assert.ok('id' in blog, 'key id is not in blog (_id may not be correctly mapped)')
    assert.ok(!('_id' in blog), '_id should not be in blog, only id')
    assert.ok(!('__v' in blog), '__v should not be in blog')
  })

  test('List returns all blogs', async () => {
    const resp = await api
      .get('/api/blogs')
      .set('authorization', `Bearer ${token}`)
      .expect(200)
      .expect('content-type', /application\/json/)
    assert(resp.body.length === helper.testBlogs.length)
  })
}))

describe('Getting specific blogs', (() => {
  test('Retrieve one blog', async () => {
    const blogs = await helper.getAllBlogs()
    const blog = await api
      .get(`/api/blogs/${blogs[0].id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200)
    assert(blog.body.url)
    assert.strictEqual(blog.body.url, blogs[0].url)
  })

  test('Retrieve non-existent blog fails', async () => {
    const blogs = await helper.getAllBlogs()
    const [realId, fakeId, malformedID] = [blogs[0].id, '6716adfd34cac8f3cbbbbbbb', 'malformedId']
    await api
      .get(`/api/blogs/${realId}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200)
    await api
      .get(`/api/blogs/${fakeId}`)
      .set('authorization', `Bearer ${token}`)
      .expect(404)
    await api
      .get(`/api/blogs/${malformedID}`)
      .set('authorization', `Bearer ${token}`)
      .expect(404)
  })
}))

describe('Creating blogs', (() => {
  test('Can create new blog', async () => {
    const beforeBlogs = await helper.getAllBlogs()
    const newBlog = { ...helper.testBlogs[0], ...{ user: user.id } }
    await api
      .post('/api/blogs')
      .set('authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
    const afterBlogs = await helper.getAllBlogs()
    assert.strictEqual(afterBlogs.length, beforeBlogs.length + 1)
    assert(afterBlogs.map(b => b.url).includes(newBlog.url))
  })

  test('Blog creation rejects bad payloads, defaults likes to 0', async () => {
    const beforeBlogs = await helper.getAllBlogs()
    const template = { ...helper.testBlogs[0], ...{ user: user.id } }
    const { url: _u, ...noUrl } = { ...template }
    const { title: _t, ...noTitle } = { ...template }
    const { likes: _l, ...noLikes } = { ...template }
    await api
      .post('/api/blogs')
      .set('authorization', `Bearer ${token}`)
      .send(noUrl)
      .expect(400)
    await api
      .post('/api/blogs')
      .set('authorization', `Bearer ${token}`)
      .send(noTitle)
      .expect(400)
    const zeroLikes = await api
      .post('/api/blogs')
      .set('authorization', `Bearer ${token}`)
      .send(noLikes)
      .expect(201)
    assert.strictEqual(zeroLikes.body.likes, 0)
    const afterBlogs = await helper.getAllBlogs()
    assert.strictEqual(afterBlogs.length, beforeBlogs.length + 1)
  })
}))

describe('Removing blogs', (() => {
  test('Can delete own blog', async () => {
    const beforeBlogs = await helper.getAllBlogs()
    const deleteId = beforeBlogs[0].id
    await api
      .delete(`/api/blogs/${deleteId}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204)
    await api
      .delete(`/api/blogs/${deleteId}`)
      .set('authorization', `Bearer ${token}`)
      .expect(404)
    const afterBlogs = await helper.getAllBlogs()
    assert.strictEqual(afterBlogs.length, beforeBlogs.length - 1)
  })
  test('Cannot delete other user blog', async () => {
    const otherUser = (await helper.injectUsers([helper.testUsers[1]]))[0]
    const otherToken = auth.generateToken(otherUser)
    // Run same test
    const beforeBlogs = await helper.getAllBlogs()
    const deleteId = beforeBlogs[0].id
    await api
      .delete(`/api/blogs/${deleteId}`)
      .set('authorization', `Bearer ${otherToken}`)
      .expect(401)
    const afterBlogs = await helper.getAllBlogs()
    assert.strictEqual(afterBlogs.length, beforeBlogs.length)
  })
}))

describe('Like blogs', (() => {
  test('Can like a blog', async () => {
    const beforeBlogs = await helper.getAllBlogs()
    const blog = beforeBlogs[0]
    const likedBlog = await api
      .put(`/api/blogs/${blog.id}/likes`)
      .set('authorization', `Bearer ${token}`)
      .expect(200)
    assert.strictEqual(likedBlog.body.likes, blog.likes + 1)
    const afterBlogs = await helper.getAllBlogs()
    assert.strictEqual(afterBlogs.length, beforeBlogs.length)
  })
}))

after(async () => {
  await mongoose.connection.close()
  // If connection left open, process never end.
  // Can see in debugger the top "blog_api.test.js" process never ends so the test execution is never done.
  // stack is: test:watch: npm -> cross-env -> blog_api.test.js
})
