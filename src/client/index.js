import './styles/style.scss';
import { handleFormSubmit } from './js/app';

export { handleFormSubmit };

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log('ServiceWorker registered successfully');
      }).catch((err) => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }