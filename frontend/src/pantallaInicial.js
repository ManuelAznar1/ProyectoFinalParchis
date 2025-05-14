import React, { useState } from 'react';
import './App.css';
import logo from './logoParchis.png';
import CrearPartida from './crearPartida';
import UnirsePartida from './unirsePartida';
import Partida from './partida';

function PantallaInicial({ onLogout }) {
  const [vista, setVista] = useState('menu'); // 'menu', 'crear', 'unirse', 'partida'

  const volverMenu = () => setVista('menu');

  if (vista === 'crear') {
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

        {/* Pasa la función para cambiar a la vista 'partida' */}
        <CrearPartida onIniciarPartida={() => setVista('partida')} />

        <button className="custom-button" onClick={volverMenu}>Volver</button>
      </div>
    );
  }

  if (vista === 'partida') {
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
        <Partida />
        <button className="custom-button" onClick={volverMenu}>Volver</button>
      </div>
    );
  }

  if (vista === 'unirse') {
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

        <UnirsePartida />

        <button className="custom-button" onClick={volverMenu}>Volver</button>
      </div>
    );
  }

  // Vista menú principal
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

        <button className="custom-button" onClick={() => setVista('crear')}>Crear Partida</button>
        <button className="custom-button" onClick={() => setVista('unirse')}>Unirse a Partida</button>

        <div className="profile-options">
          <button className="custom-button">Perfil</button>
          <button className="custom-button">Opciones</button>
        </div>
      </div>
    </div>
  );
}

export default PantallaInicial;