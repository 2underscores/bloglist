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
    await helper.loginUser(page, injectedUser)
    await expect(await page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
  })

  test('Failed Login', async ({ page }) => {
    await helper.attemptLogin(page, { ...injectedUser, ...{ password: 'false-password' } })
    await expect(page.getByText('error - Invalid credentials').first()).toBeVisible()
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
  let user, newBlogContents
  beforeAll(async ({ request }) => {
    user = await helper.injectUser(request)
  })

  beforeEach(async ({ page }) => {
    const uniqueStr = crypto.randomBytes(2).toString('hex')
    newBlogContents = {
      title: `A blog about ${uniqueStr}`,
      author: `John ${uniqueStr}`,
      url: `http://testblogurl${uniqueStr}.com`,
    }
    await page.goto(process.env.BASE_WEB_URL)
    await helper.loginUser(page, user)
  })

  test('Create Blog', async ({ page }) => {
    await helper.createBlog(page, newBlogContents)
  })

  test('Like blog', async ({ page }) => {
    await helper.createBlog(page, newBlogContents)
    await page.getByRole('button', { name: 'View' }).first().click()
    const likesDiv = page.locator('.blogLikes')
    const initialLikes = await likesDiv.textContent()
    const initialCount = parseInt(initialLikes.match(/\d+/)[0])
    await likesDiv.getByRole('button', { name: 'like' }).click()
    // Can't just grab number and compare immediately
    // Need to either use expect().toPass() to retry until pass, or use playwright locators directly in expect to handle that
    await expect(likesDiv).toContainText(`Likes: ${initialCount + 1}`)
  })

  test('Delete blog', async ({ page }) => {
    await helper.createBlog(page, newBlogContents)
    const newBlog = page.getByText(`${newBlogContents.title} - ${newBlogContents.author}`)
    await expect(newBlog).toBeVisible()
    page.on('dialog', async dialog => {
      await dialog.accept()
    })
    await newBlog.getByRole('button', { name: 'Delete' }).click()
    await expect(newBlog).not.toBeVisible({ timeout: 500 })
  })

  test.fixme('Like-ordering always applied', async ({ page }) => {
    // Make two blogs, like one and check it's first, like the other twice and confirm it's first
    // Expand ("view" button) all blogs first so can see the like count
    // Have locator for (expanded) "firstBlog", and locators for (expanded) BlogA, blogB, and confirm that first blog changes based on liking blogA/B
    page
  })
})
