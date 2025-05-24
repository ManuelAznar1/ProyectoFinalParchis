import React, { useState } from 'react';


function CrearPartida( { modo, onIniciarPartida, usuario, socket }) {
    const [jugadores, setJugadores] = useState(2);
    const [codigo, setCodigo] = useState(null);

    const generarCodigo = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const joinPartida = (codigo) => {
        if (codigo.trim()) {
            socket.emit('join', {codigo, usuario, jugadores}, (response) => {
                if (response.error) {
                    console.error('Error:', response.error);
                } else {
                    console.log('Éxito:', response);
                }
            });
        }
    };

    const crear = () => {
        if (modo === 'online') {
            const nuevoCodigo = generarCodigo();
            setCodigo(nuevoCodigo);

            joinPartida(nuevoCodigo);

            onIniciarPartida(nuevoCodigo, jugadores);

        } else {
            onIniciarPartida(null, jugadores);
        }
    };

    return (
            <div className="form-container">
                <h2>Crear Partida ({modo})</h2>
            
                {/* Selector de jugadores para ambos modos */}
                <label>Cantidad de Jugadores:</label>
                <select 
                    value={jugadores} 
                    onChange={(e) => setJugadores(Number(e.target.value))}
                    >
                    <option value={2}>2 jugadores</option>
                    <option value={3}>3 jugadores</option>
                    <option value={4}>4 jugadores</option>
                </select>
                <br />
            
                <button className="custom-button" onClick={crear}>
                    Iniciar Partida
                </button>
            </div>
            );
}

export default CrearPartida;