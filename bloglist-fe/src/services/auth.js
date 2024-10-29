import axios from 'axios';
const baseUrl = '/api'

const login = async (user, pass) => {
  console.log(user, pass);
  const resp = await axios.post(`${baseUrl}/login`, { username: user, password: pass })
  return resp
}

const createUser = async (user, name, pass) => {
  console.log(user, name, pass);
  const respUserCreate = await axios.post(`${baseUrl}/users`, { username: user, name: name, password: pass })
  return respUserCreate
}

export default { login, createUser }