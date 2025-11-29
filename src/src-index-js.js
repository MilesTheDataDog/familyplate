import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './storage';
import FamilyPlate from './FamilyPlate';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FamilyPlate />
  </React.StrictMode>
);