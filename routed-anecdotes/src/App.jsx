import { useState, useReducer } from 'react'
import { Routes, Route, useMatch, Navigate} from 'react-router-dom'

import CreateNew from './components/CreateNew'
import About from './components/About'
import AnecdoteList from './components/AnecdoteList'
import Footer from './components/Footer'
import Menu from './components/Menu'
import Anecdote from './components/Anecdote'

import NotificationContext from './components/NotificationContext'
import Notification from './components/Notification'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'CREATED':
      return `You created ${action.payload}`
    case 'VOTED':
      return `You voted for ${action.payload}`
    case 'ERROR':
      return `${action.payload}`
    case 'REMOVE':
      return ''
    default:
      return ''
  }
}

const App = () => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  )

  const notify = ({ type, payload }) => {
    notificationDispatch({ type, payload })
    setTimeout(() => {
      notificationDispatch({ type: 'REMOVE' })
    }, 5000)
  }

  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1,
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2,
    },
  ])

  const match = useMatch('/anecdotes/:id')
  const anecdote = match
    ? anecdotes.find((anecdote) => anecdote.id === Number(match.params.id))
    : null

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    }

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)))
  }

  return (
    <NotificationContext.Provider value={[notification, notify]}>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Notification />
        <Routes>
          <Route
            path="/anecdotes/:id"
            element={<Anecdote anecdote={anecdote} />}
          />
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/anecdotes" element={<Navigate replace to="/" />} />

          <Route path="/create" element={<CreateNew addNew={addNew} />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </NotificationContext.Provider>
  )
}

export default App
