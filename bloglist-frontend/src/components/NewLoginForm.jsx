import { useState } from 'react'
import { Popover, Box, FormControl, FormLabel, TextField, Button } from '@mui/material'

const NewLoginForm = ({ logIn }) => {
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
    
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
          width: 300,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <TextField
            id="username"
            type="text"
            name="username"
            autoFocus
            required
            autoComplete='username'
            variant="outlined"
            onChange={({ target }) => setUsername(target.value)}
          ></TextField>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            id="password"
            type="password"
            name="password"
            required
            autoComplete='current-password'
            variant="outlined"
            onChange={({ target }) => setPassword(target.value)}
          ></TextField>
        </FormControl>
        <Button variant="contained" type="submit">
          LogIn
        </Button>
      </Box>
  )
}

export default NewLoginForm
