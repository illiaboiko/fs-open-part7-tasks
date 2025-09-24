import { Button, Stack, Divider } from "@mui/material"
import { Link } from "react-router-dom"
import LoginForm from "./LoginForm"

const SiteMenu = ( {user, handleLogout, handleLogin}) => {
  return (
    <>
    <Stack direction="row" gap={3} divider={<Divider orientation='vertical' flexItem />} >
          <Link to="/blogs">Blogs</Link>
          <Link to="/users">Users</Link>
          <div>
            {user !== null ? (
              <div style={{display: 'flex', gap: '1rem'}}>
                <span>user <strong>{user.username}</strong> logged in</span>
                <Button variant="outlined" onClick={handleLogout}>LogOut</Button>
              </div>
            ) : (
              <LoginForm logIn={handleLogin} />
            )}
          </div>
        </Stack>
    </>
  )
}

export default SiteMenu
