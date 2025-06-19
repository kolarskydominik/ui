import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './app.tsx';
import URLStatusTracker from './features/url-status-tracker/url-status-tracker.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/url-status" element={<URLStatusTracker />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
