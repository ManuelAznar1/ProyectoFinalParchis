// src/Perfil.js
import React from 'react';

function Perfil() {
  const usuarioNombre = localStorage.getItem('usuarioNombre');

  return (
    <div className="form-box">
      <h1>Perfil de Usuario</h1>
      <p>Nombre: <strong>{usuarioNombre || 'Invitado'}</strong></p>
    </div>
  );
}

export default Perfil;