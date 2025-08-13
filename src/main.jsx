import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './enhanced-styles.css'
import { UserInteractionProvider } from './components/UserInteractionContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserInteractionProvider>
      <App />
    </UserInteractionProvider>
  </React.StrictMode>,
)