import { useState, useEffect, useRef, useReducer } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Toggable from './components/Toggable'
import notificationReducer from './reducers/notificationReducer'
import NotificationContext from './NotificationContext'
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import userReducer from './reducers/userReducer'

const App = () => {
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })
  console.log(JSON.parse(JSON.stringify(result)))
  const blogs = result.data

  const [user, userDispatch] = useReducer(userReducer, null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({
        type: 'SET_USER',
        payload: user,
      })
      setUsername('')
      setPassword('')
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

  const loginForm = () => {
    return (
      <>
        <p>Please log in:</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="login"
            id="login"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <br />
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <br />
          <button id="log-in-button" type="submit">
            log in
          </button>
        </form>
        <br />
      </>
    )
  }

  return (
    <div>
      <div>
        <h2>blogs</h2>
        {notification && (
          <NotificationContext.Provider
            value={[notification, notificationDispatch]}
          >
            <Notification />
          </NotificationContext.Provider>
        )}
        {user !== null ? (
          <div>
            <p>
              user <strong>{user.username}</strong> logged in
            </p>
            <button onClick={handleLogout}>LogOut</button>
            <Toggable buttonLabel="New Blog" ref={blogFormRef}>
              <BlogForm createBlog={handleCreateBlog} />
            </Toggable>
          </div>
        ) : (
          loginForm()
        )}

        <div className="all-blogs">
          {result.isLoading !== true ? (
            blogs.map((blog) => (
              <Blog
                addLike={likeBlog}
                deleteBlog={handleDeleteBlog}
                key={blog.id}
                blog={blog}
                user={user}
              />
            ))
          ) : (
            <>
              <p>Loading data...</p>
            </>
          )}
        </div>

        <div>
          <br />
          <footer>Illia Boiko. Exercise for course by fullstackopen.com</footer>
        </div>
      </div>
    </div>
  )
}

export default App
