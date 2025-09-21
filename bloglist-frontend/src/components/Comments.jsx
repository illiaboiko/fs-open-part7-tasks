const Comments = ({ comments, isLoading }) => {
  if (isLoading) {
    return <>Loading Comments</>
  }

  if(!comments) {
    return null
  }
  return (
    <>
    <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment}>{comment}</li>
        ))}
      </ul>
    </>
  )
}

export default Comments
