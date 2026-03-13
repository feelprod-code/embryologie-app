import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.tsx'

// Force mobile orientation lock (visual simulation)
const syncOrientation = () => {
  // window.orientation is deprecated but heavily reliable on iOS Safari
  const angle = (window as any).orientation || 0;
  // 90 = top of phone is on the left -> browser rotated CCW -> we must rotate CW (90deg)
  // -90 = top of phone is on the right -> browser rotated CW -> we must rotate CCW (-90deg)
  if (angle === 90) {
    document.documentElement.style.setProperty('--landscape-rotation', '-90deg');
  } else if (angle === -90 || angle === 270) {
    document.documentElement.style.setProperty('--landscape-rotation', '90deg');
  } else {
    document.documentElement.style.setProperty('--landscape-rotation', '-90deg');
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('orientationchange', syncOrientation);
  window.addEventListener('resize', syncOrientation);
  syncOrientation();
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
