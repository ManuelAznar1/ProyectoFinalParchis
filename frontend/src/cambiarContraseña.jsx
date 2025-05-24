// CambiarContraseña.js
import React, { useState } from 'react';

function CambiarContraseña({ volver, usuario }) {
  const [contraseñaActual, setContraseñaActual] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [loading, setLoading] = useState(false);

const manejarCambio = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch('http://localhost:3001/cambiar-contrasena', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: usuario.nombre,
        contraseñaActual,
        nuevaContraseña
      }),
    });

    const text = await response.text(); // primero lee como texto
    console.log('Respuesta cruda del servidor:', text);

    // luego intenta parsear JSON
    const data = JSON.parse(text);

    if (data.exito) {
      alert('✅ Contraseña cambiada correctamente');
      volver();
    } else {
      alert(`❌ Error: ${data.mensaje || 'No se pudo cambiar la contraseña'}`);
    }
  } catch (error) {
    console.error(error);
    alert('❌ Error de conexión con el servidor o respuesta inválida');
  } finally {
    setLoading(false);
  }
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
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" className="custom-button" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Contraseña'}
        </button>
      </form>
      <button className="custom-button" onClick={volver} disabled={loading}>Volver</button>
    </div>
  );
}


export default CambiarContraseña;