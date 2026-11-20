import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const ArduinoPortfolioPreview = lazy(() => import('./portfolio/ArduinoPortfolio'));

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {import.meta.env.DEV && window.location.pathname === '/portfolio-preview' ? (
      <div className="h-svh">
        <Suspense fallback={null}>
          <ArduinoPortfolioPreview />
        </Suspense>
      </div>
    ) : (
      <App />
    )}
  </React.StrictMode>,
);
