import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

window.API_URL = (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname === '10.170.89.7'
)
  ? `http://${window.location.hostname}:5000`
  : 'https://careerbridge-b-1.onrender.com';

// Global Scroll Animations Engine
window.initScrollAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
          setTimeout(() => {
            entry.target.classList.remove(
              'scroll-anim-card',
              'is-visible',
              'opacity-0',
              'scale-95',
              'translate-y-6',
              'scale-97',
              '-translate-x-16',
              'translate-x-16',
              'rotate-[-1deg]',
              'rotate-[1deg]',
              'lg:-translate-x-24',
              'lg:translate-y-24',
              'lg:rotate-[-2deg]',
              'lg:rotate-[2deg]',
              'lg:translate-y-0'
            );
          }, 600);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  const cards = document.querySelectorAll('.scroll-anim-card');
  cards.forEach((card) => observer.observe(card));
};

window.getScrollAnimClass = (index) => {
  return "scroll-anim-card opacity-0 scale-95 translate-y-6";
};

axios.interceptors.request.use((config) => {
  if (config.url) {
    if (config.url.includes('https://careerbridge-b-1.onrender.com')) {
      config.url = config.url.replace('https://careerbridge-b-1.onrender.com', window.API_URL);
    } else if (!config.url.startsWith('http')) {
      config.url = `${window.API_URL || 'http://localhost:5000'}${config.url}`;
    }
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
