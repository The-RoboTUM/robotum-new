import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import { BrowserRouter, HashRouter } from 'react-router-dom'

// Use HashRouter only when the app is served under a subpath (e.g., GitHub Pages)
const useHashOnSubpath = import.meta.env.PROD && import.meta.env.BASE_URL !== '/'
const Router = useHashOnSubpath ? HashRouter : BrowserRouter
const basename =
  useHashOnSubpath
    ? undefined // HashRouter doesn’t need a basename
    : (import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router {...(basename ? { basename } : {})}>
      <App />
    </Router>
  </React.StrictMode>
)