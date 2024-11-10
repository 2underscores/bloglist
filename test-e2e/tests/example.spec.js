const { test, describe, beforeEach, expect } = require('@playwright/test')
const crypto = require("crypto");


describe('Authentication', () => {
  let newUser = {
    name: 'nnn',
    username: `User-${crypto.randomBytes(2).toString('hex')}`,
    password: 'ppp',
  }
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
  })

  test('Signup new user', async ({ page }) => {
    const startLoginButton = page.getByRole('button', { name: 'Login / Signup' })
    await startLoginButton.click()
    await page.locator('#name-signup').fill(newUser.name)
    await page.locator('#username-signup').fill(newUser.username)
    await page.locator('#password-signup').fill(newUser.password)
    await page.getByRole('button', { name: 'Signup' }).click()
    await expect(await page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
  })
  test('Login existing user', async ({ page }) => {
    const startLoginButton = page.getByRole('button', { name: 'Login / Signup' })
    await startLoginButton.click()
    await page.locator('#username-login').fill(newUser.username)
    await page.locator('#password-login').fill(newUser.password)
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(await page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
  })
  test('Logout', async ({ page }) => {
    // Repeat of above
    const startLoginButton = page.getByRole('button', { name: 'Login / Signup' })
    await startLoginButton.click()
    await page.locator('#username-login').fill(newUser.username)
    await page.locator('#password-login').fill(newUser.password)
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(await page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
    // Test logout
    await expect(startLoginButton).not.toBeVisible()
    await page.getByRole('button', { name: 'Logout' }).click()
    await expect(startLoginButton).toBeVisible()

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
