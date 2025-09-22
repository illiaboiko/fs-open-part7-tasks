import { useState } from 'react'
const CommentForm = ({ createComment }) => {
  const [comment, setComment] = useState('')

  const addComment = (event) => {
    event.preventDefault()
    createComment(comment)

    setComment('')
  }

  return (
    <>
      <form onSubmit={addComment}>
        <div>
          <input
            onChange={({ target }) => setComment(target.value)}
            type="text"
            name="comment"
            id="comment"
            value={comment}
          />
        </div>
        <button type="submit" id="createBlog">
          comment
        </button>
      </form>
      <br />
    </>
  )
}

export default CommentForm
