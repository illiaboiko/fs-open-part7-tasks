import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import blogService from '../services/blogs'
import Comments from './Comments'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

const Blog = ({ blog, addLike, deleteBlog, user, notify }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5,
    display: 'block',
  }
  console.log('blog', blog)

  const queryClient = useQueryClient()

  const commentsQuery = useQuery({
    queryKey: ['comments', blog?.id],
    queryFn: () => blogService.getComments(blog.id),
    enabled: !!blog?.id,
  })
  const comments = commentsQuery.data
  const addCommentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: () => {
     queryClient.invalidateQueries({queryKey: ['comments']}) 
    },
  })

  const handleCommentCreation = async (comment) => {
    try {
      console.log('add comment', comment)
      addCommentMutation.mutate({ blog, comment })
    } catch (exception) {
      if (exception.response && exception.response.data) {
        notify({
          text: exception.response.data.error,
          type: 'error',
        })
      } else {
        notify({
          text: 'Failed to add new comment Try again',
          type: 'error',
        })
      }
    }
  }

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
          <div>
            created by:{' '}
            <Link to={`/users/${blog.user.id}`}>{blog.user.username}</Link>
          </div>
        </div>
        {user && user.username === blog.user.username ? (
          <div>
            <button onClick={() => deleteBlog(blog.id)}>delete</button>
          </div>
        ) : null}
        <Comments
          createComment={handleCommentCreation}
          comments={comments}
          isLoading={commentsQuery.isLoading}
        />
      </div>
    </div>
  )
}

export default Blog
