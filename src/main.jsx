import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App'
import ModernCyberTech from './Jimmy/Jimmy'
import ModernCyberTechV2 from './Jimmy/Jimmy1'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModernCyberTech/>
  </StrictMode>,
)
