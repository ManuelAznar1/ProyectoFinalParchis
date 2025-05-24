// src/UnirsePartida.js
import React, { useState } from 'react';
import './App.css';

function UnirsePartida( {usuario, onIniciarPartida, socket}) {
    const [codigo, setCodigo] = useState('');

    const joinPartida = (codigo) => {
        if (codigo.trim()) {

            const jugadores = 2;
            let resultCallback = '';
            socket.emit('join', {codigo, usuario, jugadores}, (response) => {
                if (response.error) {
                    console.error('Error:', response.error);
                    resultCallback=response.error;
                } else {
                    console.log('Éxito:', response);
                    
                    // TODO Aqui obtengo el numero de jugador que soy
                    // response.numJugador
                    // Aqui guardarlo en algun sitio
                    // El que crea la partida tiene que guardarse que es el jugador1
                    
                }
            });

            return resultCallback;
        }
    };

    const unirse = () => {
        if (!codigo.trim()) {
            alert('Por favor ingresa un código válido');
            return;
        }

        console.log('Intentando unirse a la partida con código: ' + codigo);

        let result = joinPartida(codigo);

        if (result === ''){
            onIniciarPartida(codigo);
        }else{
            // TODO Pintar un mensaje de que no puede unirse a la partida
            alert(result);
        }

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
