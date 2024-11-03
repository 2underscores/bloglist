import axios from 'axios';
const baseUrl = '/api'

const getConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

const list = async (token) => {
  const resp = await axios.get(`${baseUrl}/blogs`, getConfig(token))
  console.log('Blog Get: ', resp);
  return resp.data
}

const create = async (token, blog) => {
  const resp = await axios.post(`${baseUrl}/blogs`, blog, getConfig(token))
  console.log('Blog Create: ', resp);
  return resp.data
}

const delete_ = async (token, blogId) => {
  const resp = await axios.delete(`${baseUrl}/blogs/${blogId}`, getConfig(token))
  console.log(resp);
  return resp.data
}

export default { list, create, delete: delete_ }