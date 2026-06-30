import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LevelApp from './LevelApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LevelApp completed={new Set()} onComplete={() => {}} />
  </StrictMode>
)
