import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })

    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <>
      <form onSubmit={addBlog}>
        <p>new blog:</p>
        <div>
          <label htmlFor="title">title</label>
          <input
            onChange={({ target }) => setTitle(target.value)}
            type="text"
            name="title"
            id="title"
            value={title}
          />
        </div>
        <div>
          <label htmlFor="author">author</label>
          <input
            onChange={({ target }) => setAuthor(target.value)}
            type="text"
            name="author"
            id="author"
            value={author}
          />
        </div>
        <div>
          <label htmlFor="url">url</label>
          <input
            onChange={({ target }) => setUrl(target.value)}
            type="text"
            name="url"
            id="url"
            value={url}
          />
        </div>
        <button type="submit" id='createBlog'>create</button>
      </form>
      <br />
    </>
  )
}

export default BlogForm
