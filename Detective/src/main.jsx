import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Styles/fonts.css'
import './Styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
