import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

/* import App from './App' */
import TodoApp from './TODO/Todo'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoApp/>
  </StrictMode>,
)
