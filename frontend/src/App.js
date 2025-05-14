import React, { useState } from 'react';

function App() {
  // Estados para el formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [token, setToken] = useState('');

  // Estado para cambiar entre formulario de Registro e Inicio de sesión
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  // Función para registrar un nuevo usuario
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
      })
      .catch((error) => {
        setMensaje('Error al crear el usuario');
      });
  };

  // Función para iniciar sesión
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
        } else {
          setMensaje(data.error);
        }
      })
      .catch((error) => {
        setMensaje('Error al iniciar sesión');
      });
  };

  return (
    <div>
      {/* Botones para cambiar entre formularios */}
      <button onClick={() => { setMostrarRegistro(true); setMostrarLogin(false); }}>Crear Usuario</button>
      <button onClick={() => { setMostrarLogin(true); setMostrarRegistro(false); }}>Iniciar Sesión</button>

      {/* Mostrar el formulario de Registro si se presionó "Crear Usuario" */}
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
          <button onClick={registrarUsuario}>Registrar</button>
        </div>
      )}

      {/* Mostrar el formulario de Login si se presionó "Iniciar Sesión" */}
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
          <button onClick={iniciarSesion}>Iniciar Sesión</button>
        </div>
      )}

      {/* Mostrar el mensaje que retorna el backend */}
      <p>{mensaje}</p>

    </div>
  );
}

export default App;
