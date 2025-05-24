import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logoParchis.png';
import CrearPartida from './crearPartida';
import UnirsePartida from './unirsePartida';
import Partida from './partida';
import Perfil from './perfil';
import ElegirModoJuego from './elegirModoJuego';
import CambiarContraseña from './cambiarContraseña';

function PantallaInicial({ onLogout, usuario, socket }) {
  const [vista, setVista] = useState('menu');
  const [modoOscuro, setModoOscuro] = useState(false);
  const [codigoPartida, setCodigoPartida] = useState(null);
  const [modoJuego, setModoJuego] = useState(null);
  const [jugadores, setJugadores] = useState(null);

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

  const volverMenu = () => {
    setCodigoPartida(null);
    setJugadores(null);
    setModoJuego(null);
    setVista('menu');
  };

  const handleIniciarPartida = (codigo, jugadores) => {
    setCodigoPartida(codigo);
    setJugadores(jugadores);
    console.log('jugadores:' + jugadores);

    setVista('partida');
  };

  const handleIniciarPartidaOnline = (codigo, jugadores) => {
    setCodigoPartida(codigo);
    setJugadores(jugadores);
    setModoJuego('online');    
    console.log('jugadores:' + jugadores);
    console.log('modo:' + modoJuego);
    console.log('codigo:' + codigo);
    
    setVista('partida');
  };
  
const Navbar = () => (
  <nav className="navbar">
    <div className="nav-left">
      <img src={logo} alt="Logo" className="logo" />
    </div>
    <div className="nav-center">
      <h2>Parchis</h2>
    </div>
    <div className="nav-right">
      {/* Mostrar nombre de usuario si existe */}
      {usuario && usuario.nombre && (
        <span className="usuario-nombre" style={{ gap: '15px', fontWeight: 'bold' }}>
          Hola, {usuario.nombre}
        </span>
      )}
      <button className="custom-button" onClick={onLogout}>Salir</button>
    </div>
  </nav>
);


  if (vista === 'crear') {
    return (
      <div>
        <Navbar />
        <CrearPartida modo={modoJuego} onIniciarPartida={handleIniciarPartida} socket={socket} usuario={usuario?.nombre} />
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
            setModoJuego(modo);
            setVista('crear');
          }}
          volver={volverMenu}
        />
      </div>
    );
  }

  if (vista === 'cambiarContraseña') {
    return (
      <div>
        <Navbar />
        <CambiarContraseña volver={volverMenu}  usuario={usuario} />
      </div>
    );
  }

  if (vista === 'unirse') {
    return (
      <div>
        <Navbar />
        <UnirsePartida onIniciarPartida={handleIniciarPartidaOnline} socket={socket} usuario={usuario?.nombre}/>
        <button className="custom-button" onClick={volverMenu}>Volver</button>
      </div>
    );
  }

  if (vista === 'partida') {
    return (
      <div>
        <Navbar />
        <Partida
          socket={socket}
          volverMenu={volverMenu}
          codigo={codigoPartida}
          modo={modoJuego}
          jugadores={jugadores}
          usuario={usuario}
        />
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
          <button className="custom-button" onClick={() => setVista('cambiarContraseña')}>
            Cambiar Contraseña
          </button>
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
