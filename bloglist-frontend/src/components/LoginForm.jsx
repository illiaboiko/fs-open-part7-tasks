import { useState } from 'react'

const LoginForm = ({ logIn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    const result = await logIn({ username, password })

    if (result) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <>
      <p>Please log in:</p>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="login"
          id="login"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <br />
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <button id="log-in-button" type="submit">
          log in
        </button>
      </form>
      <br />
    </>
  )
}

export default LoginForm
