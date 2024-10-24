const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose') // App initializes mongo, but doesn't close it. Test close it.
const helper = require('./test_helper')

const api = supertest(app)
//: Switch to a testing DB!
let user, blogs, attached

beforeEach(async () => {
  await helper.clearData()
  user = (await helper.injectUsers([helper.testUsers[0]]))[0]
  blogs = await helper.injectBlogs(helper.testBlogs)
  const attached = await helper.attachBlogsToUser(blogs, user);
  ({ user, blogs } = attached)
})

describe('Listing blogs', (() => {

  test('Particular blog in listed blogs', async () => {
    const blog = helper.testBlogs[0]
    const blogsResp = await api.get('/api/blogs')
    assert(blogsResp.body.map(b => b.url).includes(blog.url))
  })

  test('Returned blog metadata is stripped', async () => {
    const blogsResp = await api.get('/api/blogs')
    const blog = blogsResp.body[0]
    assert.ok('id' in blog, 'key id is not in blog (_id may not be correctly mapped)')
    assert.ok(!('_id' in blog), '_id should not be in blog, only id')
    assert.ok(!('__v' in blog), '__v should not be in blog')
  })

  test('List returns all blogs', async () => {
    const resp = await api
      .get('/api/blogs')
      .expect(200)
      .expect('content-type', /application\/json/)
    assert(resp.body.length === helper.testBlogs.length)
  })
}))

describe('Getting specific blogs', (() => {
  test('Retrieve one blog', async () => {
    const blogs = await helper.getAllBlogs()
    const blog = await api.get(`/api/blogs/${blogs[0].id}`)
    assert(blog.body.url)
    assert.strictEqual(blog.body.url, blogs[0].url)
  })

  test('Retrieve non-existent blog fails', async () => {
    const blogs = await helper.getAllBlogs()
    const [realId, fakeId, malformedID] = [blogs[0].id, '6716adfd34cac8f3cbbbbbbb', 'malformedId']
    await api.get(`/api/blogs/${realId}`).expect(200)
    await api.get(`/api/blogs/${fakeId}`).expect(404)
    await api.get(`/api/blogs/${malformedID}`).expect(404)
  })
}))

describe('Creating blogs', (() => {
  test('Can create new blog', async () => {
    const beforeBlogs = await helper.getAllBlogs()
    const newBlog = { ...helper.testBlogs[0], ...{ user: user.id } }
    await api.post('/api/blogs').send(newBlog).expect(201)
    const afterBlogs = await helper.getAllBlogs()
    assert.strictEqual(afterBlogs.length, beforeBlogs.length + 1)
    assert(afterBlogs.map(b => b.url).includes(newBlog.url))
  })

  test('Blog creation rejects bad payloads, defaults likes to 0', async () => {
    const beforeBlogs = await helper.getAllBlogs()
    const template = { ...helper.testBlogs[0], ...{ user: user.id } }
    const { url, ...noUrl } = { ...template }
    const { title, ...noTitle } = { ...template }
    const { likes, ...noLikes } = { ...template }
    await api.post('/api/blogs').send(noUrl).expect(400)
    await api.post('/api/blogs').send(noTitle).expect(400)
    const zeroLikes = await api.post('/api/blogs').send(noLikes).expect(201)
    assert.strictEqual(zeroLikes.body.likes, 0)
    const afterBlogs = await helper.getAllBlogs()
    assert.strictEqual(afterBlogs.length, beforeBlogs.length + 1)
  })
}))

describe('Removing blogs', (() => {
  test('Can delete blog, get 204 or 404', async () => {
    const beforeBlogs = await helper.getAllBlogs()
    const deleteId = beforeBlogs[0].id
    const fakeId = '6716adfd34cac8f3cbbbbbbb'
    await api.delete(`/api/blogs/${deleteId}`).expect(204)
    await api.delete(`/api/blogs/${deleteId}`).expect(404)
    await api.delete(`/api/blogs/${fakeId}`).expect(404)
    const afterBlogs = await helper.getAllBlogs()
    assert.strictEqual(afterBlogs.length, beforeBlogs.length - 1)
  })
}))

describe('Like blogs', (() => {
  test('Can like a blog', async () => {
    const beforeBlogs = await helper.getAllBlogs()
    const blog = beforeBlogs[0]
    const likedBlog = await api.put(`/api/blogs/${blog.id}/likes`).expect(200)
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
