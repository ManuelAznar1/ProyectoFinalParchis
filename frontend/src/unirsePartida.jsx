// src/UnirsePartida.js
import React, { useState } from 'react';
import './App.css';

function UnirsePartida( {codigoPartida, usuario, onIniciarPartida, socket}) {
    const [codigo, setCodigo] = useState(codigoPartida);

    const joinPartida = (codigo) => {
        if (codigo.trim()) {

            socket.emit('join', {codigo, usuario}, (response) => {
                if (response.error) {
                    console.error('Error:', response.error);
                } else {
                    console.log('Éxito:', response);
                }
            });

        }
    };

    const unirse = () => {
        if (!codigo.trim()) {
            alert('Por favor ingresa un código válido');
            return;
        }

        console.log('Intentando unirse a la partida con código: ' + codigo);

        joinPartida(codigo);

        onIniciarPartida(codigo);

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
