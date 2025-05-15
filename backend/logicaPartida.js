// logicaPartida.js

const COLORES = ['rojo', 'verde', 'amarillo', 'azul'];
const NUM_FICHAS = 4;
const TABLERO_TOTAL = 68;

class LogicaPartida {
  constructor() {
    this.estado = {
      turno: 'rojo',
      dado: null,
      fichas: {
        rojo: Array(NUM_FICHAS).fill('casa'),
        verde: Array(NUM_FICHAS).fill('casa'),
        amarillo: Array(NUM_FICHAS).fill('casa'),
        azul: Array(NUM_FICHAS).fill('casa'),
      },
    };
  }

  obtenerEstado() {
    return this.estado;
  }

  tirarDado() {
    this.estado.dado = Math.floor(Math.random() * 6) + 1;
  }

  moverFicha(color, index) {
    const turno = this.estado.turno;
    const dado = this.estado.dado;
    const ficha = this.estado.fichas[color][index];

    if (color !== turno) return `No es el turno de ${color}`;
    if (dado === null) return 'Debes tirar el dado primero';

    // Sacar ficha de casa
    if (ficha === 'casa') {
      if (dado === 5) {
        const salida = this.casillaSalida(color);
        this.comerSiHay(color, salida);
        this.estado.fichas[color][index] = salida;
        return `¡${color} saca ficha ${index} a la casilla ${salida}!`;
      } else {
        return 'Necesitas un 5 para sacar ficha de casa';
      }
    }

    // Mover ficha en el tablero
    if (typeof ficha === 'number') {
      const destino = ficha + dado;
      if (destino >= TABLERO_TOTAL) {
        return 'No puedes pasarte de la meta';
      }

      const haComido = this.comerSiHay(color, destino);
      this.estado.fichas[color][index] = destino;

      if (dado === 6 || haComido) {
        this.estado.dado = null;
        return `¡${color} mueve ficha ${index} a ${destino} y repite turno!`;
      } else {
        this.siguienteTurno();
        return `¡${color} mueve ficha ${index} a ${destino}!`;
      }
    }

    return 'Movimiento no válido';
  }

  casillaSalida(color) {
    const salidas = {
      rojo: 0,
      verde: 17,
      amarillo: 34,
      azul: 51,
    };
    return salidas[color];
  }

  comerSiHay(color, casilla) {
    let haComido = false;
    for (let enemigo of COLORES) {
      if (enemigo === color) continue;
      this.estado.fichas[enemigo] = this.estado.fichas[enemigo].map(f => {
        if (f === casilla) {
          haComido = true;
          return 'casa';
        }
        return f;
      });
    }
    return haComido;
  }

  siguienteTurno() {
    const actual = COLORES.indexOf(this.estado.turno);
    this.estado.turno = COLORES[(actual + 1) % COLORES.length];
    this.estado.dado = null;
  }
}

export default LogicaPartida;
