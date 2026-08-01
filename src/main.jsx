import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

window.API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://careerbridge-b-1.onrender.com';

axios.interceptors.request.use((config) => {
  if (config.url && config.url.includes('https://careerbridge-b-1.onrender.com')) {
    config.url = config.url.replace('https://careerbridge-b-1.onrender.com', window.API_URL);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <BrowserRouter>
  <App/>
  </BrowserRouter>
)
