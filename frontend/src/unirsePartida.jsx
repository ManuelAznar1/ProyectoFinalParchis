// src/UnirsePartida.js
import React, { useState } from 'react';
import './App.css';

function UnirsePartida( {usuario, onIniciarPartida, socket}) {
    const [codigo, setCodigo] = useState('');
    


    // Función que envía un mensaje y espera la respuesta
    function enviarMensajeSincrono(evento, datos) {
      return new Promise((resolve, reject) => {
        socket.emit(evento, datos, (respuesta) => {
          // Esta función se llama cuando el servidor responde con el callback
          resolve(respuesta);
        });

        // Opcional: timeout para rechazar si tarda mucho
        setTimeout(() => {
          reject(new Error("Timeout esperando respuesta del servidor"));
        }, 5000);
      });
    }


    
    

    const joinPartida = async (codigo) => {
        if (codigo.trim()) {

            const jugadores = 2;
            let resultCallback = '';
            const respuesta = await enviarMensajeSincrono('join', {codigo, usuario, jugadores});

            if (respuesta.error) {
                console.error('Error:', respuesta.error);
                resultCallback=respuesta.error;
            } else {
                console.log('Éxito:', respuesta);

                // TODO Aqui obtengo el numero de jugador que soy
                // response.numJugador
                // Aqui guardarlo en algun sitio
                // El que crea la partida tiene que guardarse que es el jugador1

            }

            return resultCallback;
        }
    };

    const unirse = () => {
        if (!codigo.trim()) {
            alert('Por favor ingresa un código válido');
            return;
        }

        console.log('Intentando unirse a la partida con código: ' + codigo);


        joinPartida(codigo)
            .then(result => {
            if (result === ''){
                onIniciarPartida(codigo);
            }else{
                // TODO Pintar un mensaje de que no puede unirse a la partida
                alert(result);
            }

        });

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
