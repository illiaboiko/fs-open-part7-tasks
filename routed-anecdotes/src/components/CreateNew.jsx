import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NotificationContext from './NotificationContext'
import { useField } from '../hooks'

const CreateNew = (props) => {
  const navigate = useNavigate()
  const [notification, notify] = useContext(NotificationContext)

  //   const [content, setContent] = useState('')
  //   const [author, setAuthor] = useState('')
  //   const [info, setInfo] = useState('')

  const content = useField('content')
  const author = useField('author')
  const info = useField('info')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ content, author, info })
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    })
    navigate('/')
    notify({ type: 'CREATED', payload: content.value })
  }

  const handleReset = () => {
    content.onReset()
    author.onReset()
    info.onReset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  )
}

export default CreateNew
