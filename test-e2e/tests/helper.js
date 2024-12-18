const { expect } = require('@playwright/test')
const crypto = require('crypto')

// const baseSiteUrl = process.env.BASE_WEB_URL
const baseApiUrl = process.env.BASE_API_URL // Same, proxied via Vite BE dev server

const injectUser = async (request, user) => {
  const uniqueStr = crypto.randomBytes(2).toString('hex')
  const userTemplate = {
    name: `name-e2e-${uniqueStr}`,
    username: `username-e2e-${uniqueStr}`,
    password: `password-e2e-${uniqueStr}`,
  }
  const userToCreate = { ...userTemplate, ...user }
  const respUser = await request.post('/api/users', {
    data: userToCreate
  })
  console.log({ ...userTemplate, ...user })
  console.log(respUser)
  const createdUser = await respUser.json()
  createdUser.password = userToCreate.password
  console.log(createdUser)
  return createdUser
}

const attemptLogin = async (page, user) => {
  // Could just direct hit API and inject token in browser before page.goto
  await page.getByRole('button', { name: 'Login / Signup' }).click()
  await page.locator('#username-login').fill(user.username)
  await page.locator('#password-login').fill(user.password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const loginUser = async (page, user) => {
  await expect(page.getByText(`User: ${user.name}`)).not.toBeVisible()
  await attemptLogin(page, user)
  await expect(page.getByText(`User: ${user.name}`)).toBeVisible()
}

const attemptCreateBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'New Blog' }).click()
  await page.getByLabel('Title:').fill(blog.title)
  await page.getByLabel('Author:').fill(blog.author)
  await page.getByLabel('URL:').fill(blog.url)
  await page.getByRole('button', { name: 'Create' }).click()
}

const createBlog = async (page, blog) => {
  await expect(page.getByText(`${blog.title} - ${blog.author}`)).not.toBeVisible()
  await attemptCreateBlog(page, blog)
  await expect(page.getByText(`${blog.title} - ${blog.author}`)).toBeVisible()
}

module.exports = {
  injectUser,
  attemptLogin,
  loginUser,
  createBlog,
}
