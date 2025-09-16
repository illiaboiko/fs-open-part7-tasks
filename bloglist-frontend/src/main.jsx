import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import notificationReducer from './reducers/notificationReducer'
import { createStore } from 'redux'

const store = createStore(notificationReducer)
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
