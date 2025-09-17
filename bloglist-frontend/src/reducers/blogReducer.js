const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_ALL':
      return action.payload
    case 'APPEND_BLOG':
        return [...state, action.payload]
    default:
      return state
  }
}

export const getAllBlogs = (blogs) => {
  return {
    type: 'GET_ALL',
    payload: blogs
  }
}

export const appendBlog = (blog) => {
    console.log('received blog', blog)
    return {
        type: 'APPEND_BLOG',
        payload: blog
    }
}

export default blogReducer
