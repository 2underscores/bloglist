import axios from 'axios';
const baseUrl = '/api'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const list = async () => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const resp = await axios.get(`${baseUrl}/blogs`, config)
  console.log('Blog Get: ', resp);
  return resp.data
}

export default { list, setToken }