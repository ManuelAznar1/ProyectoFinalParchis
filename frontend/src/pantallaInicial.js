import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logoParchis.png';
import CrearPartida from './crearPartida';
import UnirsePartida from './unirsePartida';
import Partida from './partida';
import Perfil from './perfil';
import ElegirModoJuego from './elegirModoJuego';

function PantallaInicial({ onLogout, usuario }) {
  const [vista, setVista] = useState('menu');
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    if (modoOscuro) {
      document.body.classList.add('modo-oscuro');
    } else {
      document.body.classList.remove('modo-oscuro');
    }
  }, [modoOscuro]);

  const toggleModoOscuro = () => {
    setModoOscuro(prev => !prev);
  };

  const volverMenu = () => setVista('menu');

  const Navbar = () => (
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
  );

  if (vista === 'crear') {
    return (
      <div>
        <Navbar />
        <CrearPartida onIniciarPartida={() => setVista('partida')} />
        <button className="custom-button" onClick={() => setVista('elegirModo')}>Volver</button>
      </div>
    );
  }

  if (vista === 'elegirModo') {
    return (
      <div>
        <Navbar />
        <ElegirModoJuego
          onElegirModo={(modo) => {
            console.log("Modo elegido:", modo);
            setVista('crear');
          }}
          volver={volverMenu}
        />
      </div>
    );
  }

  if (vista === 'unirse') {
    return (
      <div>
        <Navbar />
        <UnirsePartida />
        <button className="custom-button" onClick={volverMenu}>Volver</button>
      </div>
    );
  }

  if (vista === 'partida') {
    return (
      <div>
        <Navbar />
        <Partida volverMenu={volverMenu} />
      </div>
    );
  }

  if (vista === 'perfil') {
    return (
      <div>
        <Navbar />
        <Perfil usuario={usuario} />
        <button className="custom-button" onClick={volverMenu}>Volver</button>
      </div>
    );
  }

  if (vista === 'opciones') {
    return (
      <div>
        <Navbar />
        <div className="form-container">
          <h1>Opciones</h1>
          <button className="custom-button">Cambiar Contraseña</button>
          <button className="custom-button">Idioma</button>
          <button className="custom-button" onClick={toggleModoOscuro}>
            {modoOscuro ? 'Desactivar Modo Oscuro' : 'Activar Modo Oscuro'}
          </button>
        </div>
        <button className="custom-button" onClick={volverMenu}>Volver</button>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <h1>Menú Principal</h1>

        <button className="custom-button" onClick={() => setVista('elegirModo')}>Crear Partida</button>
        <button className="custom-button" onClick={() => setVista('unirse')}>Unirse a Partida</button>

        <div className="profile-options">
          <button className="custom-button" onClick={() => setVista('perfil')}>Perfil</button>
          <button className="custom-button" onClick={() => setVista('opciones')}>Opciones</button>
        </div>
      </div>
    </div>
  );
}

export default PantallaInicial;
