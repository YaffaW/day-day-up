import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import './font.css'
import App from './App.tsx'
import Schedule from './views/schedule2/Schedule.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Schedule" element={<Schedule />} />
      </Routes>
    </BrowserRouter>
    {/* <App /> */}
  </StrictMode>,
)
