import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Init from './components/Init/Init';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root') as any);
root.render(
  <React.StrictMode>
    <CssBaseline />
    <Init />
  </React.StrictMode>
);
