import React, { useState } from 'react';
import './App.css';
import logo from './logoParchis.png'; // Asegúrate de tener un archivo logo.png en src/

function App() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [token, setToken] = useState('');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(true); // Mostrar login por defecto

  const registrarUsuario = () => {
    const usuario = { nombre, email, contrasena };

    fetch('http://localhost:3001/crear-usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    })
      .then((response) => response.json())
      .then((data) => {
        setMensaje(data.mensaje);
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

    fetch('http://localhost:3001/iniciar-sesion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          setMensaje('Inicio de sesión exitoso');
          setToken(data.token);
          setEmail('');
          setContrasena('');
        } else {
          setMensaje(data.error);
        }
      })
      .catch(() => {
        setMensaje('Error al iniciar sesión');
      });
  };

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
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <button className="custom-button" onClick={registrarUsuario}>Registrar</button>
          </div>
        )}

        {mostrarLogin && (
          <div>
            <h1>Iniciar Sesión</h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <button className="custom-button" onClick={iniciarSesion}>Iniciar Sesión</button>
          </div>
        )}

        <p>{mensaje}</p>
      </div>
    </div>
  );
}

export default App;

