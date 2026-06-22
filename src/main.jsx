import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import App from './App.jsx'
import { AppProvider } from './store/AppContext.jsx'
import { ActivityProvider } from './store/ActivityContext.jsx'
import { CarnetProvider } from './store/CarnetContext.jsx'
import { BreedsProvider } from './store/BreedsContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ActivityProvider>
          <CarnetProvider>
            <BreedsProvider>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/:screenId" element={<App />} />
              </Routes>
            </BreedsProvider>
          </CarnetProvider>
        </ActivityProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
