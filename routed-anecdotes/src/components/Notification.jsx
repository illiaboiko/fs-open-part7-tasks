import { useContext } from "react"
import NotificationContext from "./NotificationContext"

const Notification = () => {
    const [notification ] = useContext(NotificationContext)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  if (notification.length === 0) return null

  return (
    <>
      <p style={style}>{notification}</p>
    </>
  )
}
export default Notification
