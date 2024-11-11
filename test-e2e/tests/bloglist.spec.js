const { test, describe, beforeEach, expect, beforeAll } = require('@playwright/test')
const crypto = require('crypto')
const helper = require('./helper')

describe('Authentication', () => {
  let injectedUser
  const uniqueStr = crypto.randomBytes(2).toString('hex')
  let newUser = {
    name: 'name-e2e-signup-test',
    username: `username-e2e-signup-test-${uniqueStr}`,
    password: `ppp-${uniqueStr}`,
  }
  beforeAll(async ({ request }) => {
    injectedUser = await helper.injectUser(request)
  })

  beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_WEB_URL)
  })

  test('Signup', async ({ page }) => {
    await page.getByRole('button', { name: 'Login / Signup' }).click()
    await page.locator('#name-signup').fill(newUser.name)
    await page.locator('#username-signup').fill(newUser.username)
    await page.locator('#password-signup').fill(newUser.password)
    await page.getByRole('button', { name: 'Signup' }).click()
    await expect(await page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
  })

  test('Login', async ({ page }) => {
    helper.loginUser(page, injectedUser)
    await expect(await page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
  })

  test('Logout', async ({ page }) => {
    await helper.loginUser(page, injectedUser)
    const startLoginButton = page.getByRole('button', { name: 'Login / Signup' })
    await expect(startLoginButton).not.toBeVisible()
    await page.getByRole('button', { name: 'Logout' }).click()
    await expect(startLoginButton).toBeVisible()

  })
})

describe('Blogs', () => {
  let user
  beforeAll(async ({ request }) => {
    user = await helper.injectUser(request)
  })

  beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_WEB_URL)
    await helper.loginUser(page, user)
  })

  test('Create Blog', async ({ page }) => {
    const newBlogContents = {
      title: 'Test blog title',
      author: 'test blog author',
      url: 'http://testblogurl.com',
    }
    await helper.createBlog(page, newBlogContents)
  })
})
