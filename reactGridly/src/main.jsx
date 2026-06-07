import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/css/auth.css'
import './assets/css/global.css'
import './assets/css/index.css'
import './assets/css/usuario.css'
import './assets/css/detalle.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
