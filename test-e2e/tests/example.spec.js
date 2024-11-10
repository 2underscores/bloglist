const { test, describe, beforeEach, expect } = require('@playwright/test')
const crypto = require("crypto")
const helper = require('./helper')


describe('Authentication', () => {
  let injectedUser
  let newUser = {
    name: 'nnn',
    username: `User-${crypto.randomBytes(2).toString('hex')}`,
    password: 'ppp',
  }
  beforeEach(async ({ page, request }) => {
    await page.goto(process.env.BASE_WEB_URL)
    injectedUser = await helper.injectUser(page, request)
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
    helper.loginUser(page, injectedUser)
    const startLoginButton = page.getByRole('button', { name: 'Login / Signup' })
    await expect(startLoginButton).not.toBeVisible()
    await page.getByRole('button', { name: 'Logout' }).click()
    await expect(startLoginButton).toBeVisible()

  })
})

describe('Blogs', () => {
  let user
  beforeEach(async ({ page, request }) => {
    await page.goto(process.env.BASE_WEB_URL)
    user = await helper.injectUser(page, request)
    helper.loginUser(page, user)
  })
  test('Create Blog', async ({ page }) => {
    console.log('Create Blog User: ', user)
    const newBlogContents = {
      title: 'Test blog title',
      author: 'test blog author',
      url: 'http://testblogurl.com',
    }
    await page.getByRole('button', { name: 'New Blog' }).click();
    await page.getByLabel('Title:').fill(newBlogContents.title)
    await page.getByLabel('Author:').fill(newBlogContents.author)
    await page.getByLabel('URL:').fill(newBlogContents.url)
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page.getByText(`${newBlogContents.title} - ${newBlogContents.author}`)).toBeVisible()
  })
})

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
