import React, { useState } from 'react';
import './App.css';
import logo from './logoParchis.png';
import PantallaInicial from './pantallaInicial';
import { io } from 'socket.io-client';

/*
const socket = io('/', {
  path: '/backend/socket.io',
  transports: ["websocket", "polling"]  // fuerza transports para evitar problemas  
});*/

const socket = io(import.meta.env.VITE_BACKEND_HOST_WS, {
  path: import.meta.env.VITE_BACKEND_HOST_WS_PATH + '/socket.io',
  transports: ["websocket", "polling"]  // fuerza transports para evitar problemas  
});


function App() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [token, setToken] = useState(null);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(true);

  const registrarUsuario = () => {
    const usuario = { nombre, email, contrasena };

    fetch(import.meta.env.VITE_BACKEND_HOST+'/crear-usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Respuesta del backend al registrar:', data); // LOG para depurar
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('usuarioNombre', data.nombre);
          localStorage.setItem('usuarioEmail', email);
          localStorage.setItem('usuarioFechaRegistro', data.fechaRegistro); // <-- aquí
          setMensaje('Registro exitoso');
        } else {
          setMensaje(data.mensaje || 'Error al registrar');
        }
        setNombre('');
        setEmail('');
        setContrasena('');
      })
      .catch(() => {
        setMensaje('Error al crear el usuario');
      });
  };

  const iniciarSesion = () => {
    const usuario = { email, contrasena };

    fetch(import.meta.env.VITE_BACKEND_HOST+'/iniciar-sesion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Respuesta del backend al iniciar sesión:', data); // LOG para depurar
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('usuarioNombre', data.nombre);
          localStorage.setItem('usuarioEmail', email);
          localStorage.setItem('usuarioFechaRegistro', data.fechaRegistro); // <-- aquí
          setMensaje('Inicio de sesión exitoso');
        } else {
          setMensaje(data.error || 'Credenciales incorrectas');
        }
        setEmail('');
        setContrasena('');
      })
      .catch(() => {
        setMensaje('Error al iniciar sesión');
      });
  };

  if (token) {
    return (
      <PantallaInicial

        onLogout={() => {
          setToken(null);
          localStorage.removeItem('usuarioNombre');
          localStorage.removeItem('usuarioEmail');
          localStorage.removeItem('usuarioFechaRegistro');
        }}
        usuario={{
          nombre: localStorage.getItem('usuarioNombre'),
          email: localStorage.getItem('usuarioEmail'),
          fechaRegistro: localStorage.getItem('usuarioFechaRegistro'),
        }}
        
        socket={socket}
      />
    );
  }

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
          <button className="custom-button" onClick={() => { setMostrarRegistro(true); setMostrarLogin(false); }}>Registrarse</button>
          <button className="custom-button" onClick={() => { setMostrarLogin(true); setMostrarRegistro(false); }}>Iniciar Sesión</button>
        </div>
      </nav>

      <div className="form-container">
        {mostrarRegistro && (
          <div>
            <h1>Registro de Usuario</h1>
            <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
            <button className="custom-button" onClick={registrarUsuario}>Registrar</button>
          </div>
        )}

        {mostrarLogin && (
          <div>
            <h1>Iniciar Sesión</h1>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
            <button className="custom-button" onClick={iniciarSesion}>Iniciar Sesión</button>
          </div>
        )}

        <p>{mensaje}</p>
      </div>
    </div>
  );
}

export default App;

