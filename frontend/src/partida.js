// src/Partida.js
import React from 'react';
import './Partida.css';

function Partida() {
  // Parchís clásico: 15x15 tablero
  // Colores de zonas: rojo, verde, amarillo, azul
  // Casillas normales: beige o blancas
  // Te marco las casas y la zona segura

  // Para simplificar, haremos un array 15x15 con etiquetas para cada tipo de casilla

  const tablero = [
    ['r','r','r','r','r','','','','','','','v','v','v','v'],
    ['r','','','','r','','','','','','','v','','','v'],
    ['r','','','','r','','','','','','','v','','','v'],
    ['r','','','','r','','','','','','','v','','','v'],
    ['r','r','r','r','r','','','','','','','v','v','v','v'],
    ['','','','','','','','','','','','','','',''],
    ['','','','','','','','','','','','','','',''],
    ['','','','','','','','','','','','','','',''],
    ['','','','','','','','','','','','','','',''],
    ['','','','','','','','','','','','','','',''],
    ['y','y','y','y','y','','','','','','','b','b','b','b'],
    ['y','','','','y','','','','','','','b','','','b'],
    ['y','','','','y','','','','','','','b','','','b'],
    ['y','','','','y','','','','','','','b','','','b'],
    ['y','y','y','y','y','','','','','','','b','b','b','b'],
  ];

  // Leyenda de etiquetas:
  // 'r' = rojo
  // 'v' = verde
  // 'y' = amarillo (yellow)
  // 'b' = azul (blue)
  // ''  = casilla normal

  // Renderizamos el tablero como grid 15x15

  return (
    <div className="partida-container">
      <h2>Tablero de Parchís</h2>
      <div className="tablero">
        {tablero.map((fila, i) =>
          fila.map((casilla, j) => {
            let clase = "casilla";
            if (casilla === 'r') clase += " rojo";
            else if (casilla === 'v') clase += " verde";
            else if (casilla === 'y') clase += " amarillo";
            else if (casilla === 'b') clase += " azul";
            else clase += " normal";

            return <div key={`${i}-${j}`} className={clase}></div>;
          })
        )}
      </div>
    </div>
  );
}

export default Partida;
