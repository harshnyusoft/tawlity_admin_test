import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import UserDetails from './pages/UserManagement/View.jsx';

import './index.css';
import './i18n.js';
import { LoadScript } from '@react-google-maps/api';
import { getConfig } from './utils/config.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadScript
      googleMapsApiKey={getConfig().GOOGLE_API_KEY}
      libraries={['places']}
    >
      <App />
    </LoadScript>
  </StrictMode>
);