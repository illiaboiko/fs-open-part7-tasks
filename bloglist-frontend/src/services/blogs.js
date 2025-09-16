import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const createBlog = async (newBlogObj) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newBlogObj, config)
  return response.data
}

const addLike = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const updateBody = {
    likes: blog.likes + 1,
  }
  const response = await axios.put(`${baseUrl}/${blog.id}`, updateBody, config)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, setToken, createBlog, addLike, deleteBlog }
