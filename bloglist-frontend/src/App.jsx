import { useEffect, useRef, useReducer } from 'react'
import Notification from './components/Notification'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'
import notificationReducer from './reducers/notificationReducer'
import NotificationContext from './NotificationContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import userReducer from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useMatch,
  Navigate,
  Link,
} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import AllBlogs from './components/AllBlogs'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import SiteMenu from './components/SiteMenu'
import { SiteFooter } from './components/SiteFooter'
import { Container, Stack } from '@mui/material'
import ResponsiveAppBar from './components/ResponsiveAppBar'

const App = () => {
  const [user, userDispatch] = useReducer(userReducer, null)

  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  const blogFormRef = useRef(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({
        type: 'SET_USER',
        payload: user,
      })
      blogService.setToken(user.token)
    }
  }, [])

  const notify = ({ text, type }) => {
    notificationDispatch({
      type: 'SET_NOTIFICATION',
      payload: { text, type },
    })

    setTimeout(() => {
      notificationDispatch({
        type: 'REMOVE_NOTIFICATION',
      })
    }, 3000)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({
        type: 'SET_USER',
        payload: user,
      })
      // setUsername('')
      // setPassword('')
      notify({
        text: 'Login Successful!',
        type: 'success',
      })
    } catch (exception) {
      if (exception.response && exception.response.data) {
        notify({
          text: exception.response.data.error,
          type: 'error',
        })
      } else {
        notify({
          text: 'Login Failed. Please try again',
          type: 'error',
        })
      }
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    userDispatch({
      type: 'REMOVE_USER',
    })
    notify({
      text: 'successful logout',
      type: 'success',
    })
  }

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const handleCreateBlog = async (newBlogObj) => {
    blogFormRef.current.toggleVisibility()
    try {
      // await blogService.createBlog(newBlogObj)
      newBlogMutation.mutate(newBlogObj)

      notify({
        text: 'New blog added!',
        type: 'success',
      })
    } catch (exception) {
      if (exception.response && exception.response.data) {
        notify({
          text: exception.response.data.error,
          type: 'error',
        })
      } else {
        notify({
          text: 'Failed to create blo. Try again',
          type: 'error',
        })
      }
    }
  }

  const likeBlogMutation = useMutation({
    mutationFn: blogService.addLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const likeBlog = async (blog) => {
    try {
      console.log('like blog', blog)
      likeBlogMutation.mutate(blog)
    } catch (exception) {
      if (exception.response && exception.response.data) {
        notify({
          text: exception.response.data.error,
          type: 'error',
        })
      } else {
        notify({
          text: 'Failed to like blog. Try again',
          type: 'error',
        })
      }
    }
  }

  const handleDeleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete blog?')) {
      return
    }

    try {
      handleDeleteBlogMutation.mutate(id)
      notify({
        type: 'success',
        text: 'deleted a blog',
      })
    } catch (exception) {
      if (exception.response && exception.response.data) {
        notify({
          text: exception.response.data.error,
          type: 'error',
        })
      } else {
        notify({
          text: 'Failed to delete blog. Try again',
          type: 'error',
        })
      }
    }
  }

  const padding = {
    padding: 5,
  }

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })
  const blogs = blogsQuery.data

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })
  const users = usersQuery.data

  const userMatch = useMatch('/users/:id')
  let userForComponent = null
  if (users) {
    userForComponent = userMatch
      ? users.find((user) => user.id === userMatch.params.id)
      : null
  }

  const blogMatch = useMatch('/blogs/:id')
  let blogForComponent = null
  if (blogs) {
    blogForComponent = blogMatch
      ? blogs.find((blog) => blog.id === blogMatch.params.id)
      : null
  }

  const navStyle = {
    display: 'flex',
    gap: '1rem',
    backgroundColor: '#f4f4f4',
    padding: '10px 20px',
    borderBottom: '1px solid #ddd',
  }

  return (
    <>
        <Stack spacing={2}>
          <ResponsiveAppBar user={user} handleLogout={handleLogout} handleLogin={handleLogin}/>
          {/* <SiteMenu
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          /> */}

          {/* notification component */}
          {notification && (
            <NotificationContext.Provider
              value={[notification, notificationDispatch]}
            >
              <Notification />
            </NotificationContext.Provider>
          )}

          <Container>
            <Routes>
              <Route
                path="/users"
                element={<Users users={users} result={usersQuery} />}
              />
              <Route
                path="/users/:id"
                element={<User user={userForComponent} result={usersQuery} />}
              />
              <Route
                path="/"
                element={
                  <AllBlogs
                    user={user}
                    blogs={blogs}
                    likeBlog={likeBlog}
                    result={blogsQuery}
                    handleDeleteBlog={handleDeleteBlog}
                    handleCreateBlog={handleCreateBlog}
                    blogFormRef={blogFormRef}
                  />
                }
              />
              <Route path="/blogs" element={<Navigate replace to="/" />} />
              <Route
                path="/blogs/:id"
                element={
                  <Blog
                    addLike={likeBlog}
                    deleteBlog={handleDeleteBlog}
                    blog={blogForComponent}
                    user={user}
                    notify={notify}
                  />
                }
              />
            </Routes>
          </Container>

          <SiteFooter />
        </Stack>
    </>
  )
}

export default App
