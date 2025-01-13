import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App'
import ModernCyberTech from './Jimmy/jimmy'
import ModernCyberTechV2 from './Jimmy/Jimmy1'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModernCyberTechV2/>
  </StrictMode>,
)
