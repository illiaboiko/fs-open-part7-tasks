import { Link } from "react-router-dom"

const Users = ({ users, result }) => {
  const isLoading = result.isLoading || false

  if (isLoading) {
    return <>Loading data...</>
  }
  console.log('users', users)

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td>&nbsp;</td>
            <td><strong> Blogs Created</strong></td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`} >{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Users
