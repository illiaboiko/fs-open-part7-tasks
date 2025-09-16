const Notification = ({ text, type }) => {
  let color = ''

  switch (type) {
  case 'error':
    color = 'red'
    break
  case 'success':
    color = 'green'
    break
  default:
    break
  }

  const style = {
    padding: '2px',
    borderRadius: '5px',
    borderColor: color,
    border: '2px solid',
    color: color,
  }

  return (
    <>
      <div className="notification" style={style}>
        <p>{text}</p>
      </div>
    </>
  )
}

export default Notification
