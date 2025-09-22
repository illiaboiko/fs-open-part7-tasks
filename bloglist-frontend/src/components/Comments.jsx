import CommentForm from "./CommentForm"

const Comments = ({ comments, isLoading , createComment}) => {
  if (isLoading) {
    return <>Loading Comments</>
  }

  if(!comments) {
    return null
  }
  return (
    <>
    <h3>Comments</h3>
    <CommentForm  createComment={createComment} />
      <ul>
        {comments.map((comment) => (
          <li key={comment}>{comment}</li>
        ))}
      </ul>
    </>
  )
}

export default Comments
