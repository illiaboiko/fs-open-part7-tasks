import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import blogService from '../services/blogs'
import Comments from './Comments'

const Blog = ({ blog, addLike, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5,
    display: 'block',
  }

  const commentsQuery = useQuery({
    queryKey: ['comments'],
    queryFn: () => blogService.getComments(blog.id),
  })
  const comments = commentsQuery.data

  if (!blog) {
    return <>no blog data</>
  }

  return (
    <div style={blogStyle}>
      <div>
        <h2>
          {blog.title} by {blog.author}
        </h2>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          {blog.likes} likes
          <button onClick={() => addLike(blog)} data-testid="like-btn">
            like
          </button>
          <div>created by: {blog.user.username}</div>
        </div>
        {user && user.username === blog.user.username ? (
          <div>
            <button onClick={() => deleteBlog(blog.id)}>delete</button>
          </div>
        ) : null}
        <Comments comments={comments} isLoading={commentsQuery.isLoading} />
      </div>
    </div>
  )
}

export default Blog
