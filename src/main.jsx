import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

window.API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
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
      threshold: 0,
      rootMargin: "0px 0px 80px 0px"
    }
  );

  const cards = document.querySelectorAll('.scroll-anim-card');
  cards.forEach((card) => observer.observe(card));
};

window.getScrollAnimClass = (index) => {
  const isMobileLeft = index % 2 === 0;
  const mobileClass = isMobileLeft 
    ? "-translate-x-16 rotate-[-1deg]" 
    : "translate-x-16 rotate-[1deg]";

  let desktopClass = "";
  if (index % 3 === 0) {
    desktopClass = "lg:-translate-x-24 lg:translate-y-0 lg:rotate-[-2deg]";
  } else if (index % 3 === 1) {
    desktopClass = "lg:translate-x-0 lg:translate-y-24 lg:rotate-0";
  } else {
    desktopClass = "lg:translate-x-24 lg:translate-y-0 lg:rotate-[2deg]";
  }

  return `scroll-anim-card opacity-0 ${mobileClass} ${desktopClass}`;
};

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
