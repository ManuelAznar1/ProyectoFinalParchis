// CambiarContraseña.js
import React, { useState } from 'react';

function CambiarContraseña({ volver }) {
  const [contraseñaActual, setContraseñaActual] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');

  const manejarCambio = (e) => {
    e.preventDefault();
    // Aquí iría una petición al backend para actualizar la contraseña
    console.log('Contraseña actual:', contraseñaActual);
    console.log('Nueva contraseña:', nuevaContraseña);
    alert('✅ Contraseña cambiada (simulado)');
    volver(); // Vuelve a la vista anterior
  };

  return (
    <div className="form-container">
      <h1>Cambiar Contraseña</h1>
      <form onSubmit={manejarCambio}>
        <input
          type="password"
          placeholder="Contraseña actual"
          value={contraseñaActual}
          onChange={(e) => setContraseñaActual(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
          required
        />
        <button type="submit" className="custom-button">Guardar Contraseña</button>
      </form>
      <button className="custom-button" onClick={volver}>Volver</button>
    </div>
  );
}

export default CambiarContraseña;