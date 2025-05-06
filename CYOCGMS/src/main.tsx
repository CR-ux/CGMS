import React from 'react';
import ReactDOM from 'react-dom/client';
import SongBook from './components/SongBook';
import './index.css';
const root = document.getElementById('root');
//
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <SongBook />
    </React.StrictMode>
  );
} else {
  console.error('❌ Root element not found');
}