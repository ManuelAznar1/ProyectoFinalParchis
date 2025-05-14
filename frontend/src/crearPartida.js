// src/crearPartida.js
import React, { useState } from 'react';

function CrearPartida({ onIniciarPartida }) {
  const [jugadores, setJugadores] = useState(2);

  const crear = () => {
    // Aquí podrías hacer una llamada al backend si quieres
    console.log(`Partida creada con ${jugadores} jugadores`);
    onIniciarPartida(); // 👈 Ir al tablero
  };

  return (
    <div className="form-container">
      <h2>Crear Partida</h2>
      <label>Cantidad de Jugadores:</label>
      <select value={jugadores} onChange={(e) => setJugadores(Number(e.target.value))}>
        <option value={2}>2 jugadores</option>
        <option value={3}>3 jugadores</option>
        <option value={4}>4 jugadores</option>
      </select>
      <br />
      <button className="custom-button" onClick={crear}>Iniciar Partida</button>
    </div>
  );
}

export default CrearPartida;