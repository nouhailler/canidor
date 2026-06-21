import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import App from './App.jsx'
import { AppProvider } from './store/AppContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/:screenId" element={<App />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
