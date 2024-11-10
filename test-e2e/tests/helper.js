const crypto = require('crypto')

// const baseSiteUrl = process.env.BASE_WEB_URL
const baseApiUrl = process.env.BASE_API_URL // Same, proxied via Vite BE dev server

const injectUser = async (page, request, user) => {
  const uniqueStr = crypto.randomBytes(2).toString('hex')
  const userTemplate = {
    name: `name-e2e-${uniqueStr}`,
    username: `username-e2e-${uniqueStr}`,
    password: `password-e2e-${uniqueStr}`,
  }
  const userToCreate = { ...userTemplate, ...user }
  const respUser = await request.post(`${baseApiUrl}/users`, {
    data: userToCreate
  })
  console.log({ ...userTemplate, ...user })
  console.log(respUser)
  const createdUser = await respUser.json()
  createdUser.password = userToCreate.password
  console.log(createdUser)
  return createdUser
}

const loginUser = async (page, user) => {
  await page.getByRole('button', { name: 'Login / Signup' }).click()
  await page.locator('#username-login').fill(user.username)
  await page.locator('#password-login').fill(user.password)
  await page.getByRole('button', { name: 'Login' }).click()
}

module.exports = {
  injectUser,
  loginUser,
}
