const User = ({ user, result }) => {

 const isLoading = result.isLoading || false

  if (isLoading) {
    return <>Loading data...</>
  }   

  return (
    <>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  )
}

export default User
