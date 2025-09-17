import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    getAllBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    deleteBlog(state, action) {
      const idToDelete = action.payload
      return state.filter((blog) => blog.id !== idToDelete)
    },
    likeBlog(state, action) {
      const likedBlog = action.payload
      console.log('liked blog in reducer', likedBlog)
      return state.map((blog) =>
        blog.id === likedBlog.id ? likedBlog : blog
      )
    },
  },
})

export const { getAllBlogs, appendBlog, deleteBlog, likeBlog } =
  blogSlice.actions
export default blogSlice.reducer
