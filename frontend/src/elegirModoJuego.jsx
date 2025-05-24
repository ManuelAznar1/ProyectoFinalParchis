// src/elegirModoJuego.js
import React from 'react';

function ElegirModoJuego({ onElegirModo, volver }) {
  return (
    <div className="form-container">
      <h2>¿Cómo quieres jugar?</h2>
      <button className="custom-button" onClick={() => onElegirModo('cpu')} style={{display: 'none'}}>
        Jugar contra la CPU
      </button>
      <button className="custom-button" onClick={() => onElegirModo('local')}>
        Jugar en local
      </button>
      <button className="custom-button" onClick={() => onElegirModo('online')}>
        Jugar online
      </button>
      <button className="custom-button" onClick={volver}>Volver</button>
    </div>
  );
}

export default ElegirModoJuego;