const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'REMOVE':
      return null
    default:
      return state
  }
}

export const setNotification = ({ type, text }) => {
  return {
    type: 'SET',
    payload: {
      type,
      text,
    },
  }
}

export const removeNotification = () => {
  return {
    type: 'REMOVE',
  }
}

export default notificationReducer
