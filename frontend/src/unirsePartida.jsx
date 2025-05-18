// src/UnirsePartida.js
import React, { useState } from 'react';
import './App.css';

function UnirsePartida() {
  const [codigo, setCodigo] = useState('');

  const unirse = () => {
    if (!codigo.trim()) {
      alert('Por favor ingresa un código válido');
      return;
    }
    alert(`Intentando unirse a la partida con código: ${codigo}`);
    // Aquí podrías hacer la llamada al backend para unirse a la partida
  };

  return (
    <div className="form-container">
      <h1>Unirse a Partida</h1>
      <input
        type="text"
        placeholder="Código de la partida"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />
      <br />
      <button className="custom-button" onClick={unirse}>
        Unirse a Partida
      </button>
    </div>
  );
}

export default UnirsePartida;
