// src/PantallaInicial.js
import React from 'react';
import './App.css';
import logo from './logoParchis.png';

function PantallaInicial({ onLogout }) {
  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="nav-center">
          <h2>Parchis</h2>
        </div>
        <div className="nav-right">
          <button className="custom-button" onClick={onLogout}>Salir</button>
        </div>
      </nav>

      <div className="form-container">
        <h1>Menú Principal</h1>

        <button className="custom-button">Crear Partida</button>
        <button className="custom-button">Unirse a Partida</button>

        <div className="profile-options">
          <button className="custom-button">Perfil</button>
          <button className="custom-button">Opciones</button>
        </div>
      </div>
    </div>
  );
}

export default PantallaInicial;

