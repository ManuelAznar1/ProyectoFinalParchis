// src/perfil.js
import React from 'react';

function Perfil({ usuario }) {
  const usuarioNombre = usuario?.nombre || localStorage.getItem('usuarioNombre') || 'Invitado';
  const email = usuario?.email || localStorage.getItem('usuarioEmail') || 'Sin correo';
  const fechaRegistroRaw = usuario?.fechaRegistro || localStorage.getItem('usuarioFechaRegistro') || null;

  // Cambiar espacio por 'T' para que Date lo reconozca bien
  const fechaRegistroISO = fechaRegistroRaw ? fechaRegistroRaw.replace(' ', 'T') : null;

  const fechaRegistro = fechaRegistroISO
    ? new Date(fechaRegistroISO).toLocaleDateString()
    : 'Desconocida';

  return (

    <div className="form-box">


      <h1>Perfil de Usuario</h1>
      <p>Nombre: <strong>{usuarioNombre}</strong></p>
      <p>Correo: <strong>{email}</strong></p>
      <p>Cuenta creada el: <strong>{fechaRegistro}</strong></p>
    </div>
  );
}

export default Perfil;
