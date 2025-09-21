import Blog from './Blog'
import Toggable from './Toggable'
import BlogForm from './BlogForm'
import { Link } from 'react-router-dom'

const AllBlogs = ({
  user,
  blogs,
  result,
  likeBlog,
  handleDeleteBlog,
  handleCreateBlog,
  blogFormRef,
}) => {


  

  const isLoading = result.isLoading || false

  const style = {
    border: '1px solid',
    color: 'black',
    padding: '1rem',
    display: 'block',
  }
  return (
    <>
    <h2>blog app</h2>
      <Toggable buttonLabel="New Blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Toggable>
      <div className="all-blogs">
        {isLoading !== true ? (
          blogs.map((blog) => (
            <p key={blog.id}>
              <Link to={`/blogs/${blog.id}`}  style={style}>
                <strong>{blog.title}</strong> <strong>{blog.author}</strong>
              </Link>
            </p>
          ))
        ) : (
          <>
            <p>Loading data...</p>
          </>
        )}
      </div>
    </>
  )
}

export default AllBlogs
