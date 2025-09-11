const Anecdote = ({ anecdote }) => {
  const { content, author, votes, info } = anecdote

  return (
    <div>
      <h2>{content}</h2>
      <p>Author: {author}</p>
      <p>has {votes} votes</p>
      <p>
        for more info see <a href={info}>{info}</a>
      </p>
    </div>
  )
}

export default Anecdote
