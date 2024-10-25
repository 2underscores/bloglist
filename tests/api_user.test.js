const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose') // App initializes mongo, but doesn't close it. Test close it.
const helper = require('./test_helper')
const auth = require('../utils/auth')

const api = supertest(app)
//: Switch to a testing DB!
let users, tokens

beforeEach(async () => {
  await helper.clearData()
  users = await helper.injectUsers(helper.testUsers)
  tokens = users.map(u => auth.generateToken(u))
})

describe('User Management', () => {
  test('Can list all users', async () => {
    const usersResp = await api
      .get('/api/users')
      .set('authorization', `Bearer ${tokens[0]}`)
      .expect(200)
    assert.strictEqual(usersResp.body.length, users.length)
  })
  test('List contains specific user', async () => {
    const user = users[0]
    const usersResp = await api
      .get('/api/users')
      .set('authorization', `Bearer ${tokens[0]}`)
      .expect(200)
    assert(usersResp.body.map(u => u.username).includes(user.username))
  })
  test('Retrieve specific user', async () => {
    const user = users[0]
    const userResp = await api
      .get(`/api/users/${user.id}`)
      .set('authorization', `Bearer ${tokens[0]}`)
      .expect(200)
    assert.strictEqual(userResp.body.username, user.username)
  })
  test('Can create unique user', async () => {
    const initialUsers = await helper.getAllUsers()
    const newUser = { ...helper.testUsers[0] }
    newUser.username = `UniqueUsername${Date.now()}`
    const userResp = await api
      .post('/api/users')
      // .set('authorization', `Bearer ${tokens[0]}`) // No token required for creating user
      .send(newUser)
      .expect(200)
    const afterUsers = await helper.getAllUsers()
    assert.strictEqual(userResp.body.username, newUser.username)
    assert.strictEqual(afterUsers.length, initialUsers.length + 1)
  })
  test('Cannot create duplicate user', async () => {
    const initialUsers = await helper.getAllUsers()
    const newUser = { ...helper.testUsers[0] }
    newUser.username = initialUsers[0].username // explicit match
    const userResp = await api
      .post('/api/users')
      .set('authorization', `Bearer ${tokens[0]}`)
      .send(newUser)
      .expect(500)
    const afterUsers = await helper.getAllUsers()
    assert.strictEqual(userResp.status, 500) // TODO: Return duplicate message, better status code
    assert.strictEqual(afterUsers.length, initialUsers.length)
  })
})

after(async () => {
  await mongoose.connection.close()
  // If connection left open, process never end.
  // Can see in debugger the top "blog_api.test.js" process never ends so the test execution is never done.
  // stack is: test:watch: npm -> cross-env -> blog_api.test.js
})
