import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Toggable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef(null)

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs([...blogs].sort((a, b) => b.likes - a.likes)))
  }, [updateTrigger])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({
        text: 'Login Successful!',
        type: 'success',
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      if (exception.response && exception.response.data) {
        setNotification({
          text: exception.response.data.error,
          type: 'error',
        })
      } else {
        setNotification({
          text: 'Login Failed. Please try again',
          type: 'error',
        })
      }

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleCreateBlog = async (newBlogObj) => {
    blogFormRef.current.toggleVisibility()
    try {
      await blogService.createBlog(newBlogObj)

      setUpdateTrigger((prev) => prev + 1)

      setNotification({
        text: 'New blog added!',
        type: 'success',
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      if (exception.response && exception.response.data) {
        setNotification({
          text: exception.response.data.error,
          type: 'error',
        })
      } else {
        setNotification({
          text: 'Failed to create blo. Try again',
          type: 'error',
        })
      }

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const likeBlog = async (blog) => {
    try {
      await blogService.addLike(blog)
      setUpdateTrigger((prev) => prev + 1)
    } catch (exception) {
      if (exception.response && exception.response.data) {
        setNotification({
          text: exception.response.data.error,
          type: 'error',
        })
      } else {
        setNotification({
          text: 'Failed to like blog. Try again',
          type: 'error',
        })
      }

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleDeleteBlog = async (id) => {

    if(!window.confirm('Delete blog?')) {
      return
    }

    try {
      await blogService.deleteBlog(id)
      setUpdateTrigger((prev) => prev + 1)
    } catch (exception) {
      if (exception.response && exception.response.data) {
        setNotification({
          text: exception.response.data.error,
          type: 'error',
        })
      } else {
        setNotification({
          text: 'Failed to delete blog. Try again',
          type: 'error',
        })
      }

      setTimeout(() => {
        setNotification(null)
      }, 5000)
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
          <button id='log-in-button' type="submit">log in</button>
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
          <Notification text={notification.text} type={notification.type} />
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
          {blogs.map((blog) => (
            <Blog
              addLike={likeBlog}
              deleteBlog={handleDeleteBlog}
              key={blog.id}
              blog={blog}
              user={user}
            />
          ))}
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
