import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';  // Asegúrate de importar BrowserRouter
import App from './App';

ReactDOM.render(
  <BrowserRouter>  {/* Aquí envolvemos App con BrowserRouter */}
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);