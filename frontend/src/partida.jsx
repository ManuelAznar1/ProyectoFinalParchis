import React, { useEffect, useState, useRef } from 'react';
import './Partida.css';
import axios from 'axios';
import Chat from './Chat';
import TableroParchis from './TableroParchis';

function Partida({ volverMenu, codigo, usuario, modo, jugadores = 2, socket, numJugador }) {
    const [dice, setDice] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [turnoActual, setTurnoActual] = useState(1);
    const [mensaje, setMensaje] = useState('');
    const [hayGanador, setHayGanador] = useState(null);
    const [ultimoDado, setUltimoDado] = useState(1);

    const tableroRef = useRef();

    const DEBUG = import.meta.env.DEV;

    const coloresJugadores = {
        1: 'amarillo',
        2: 'verde',
        3: 'rojo',
        4: 'azul'
    };

    //    // Guardar el último valor de dice cuando no es null
    //    useEffect(() => {
    //        //if (dice !== null) {
    //            setUltimoDado(dice);
    //        //}
    //    }, [dice]);

    useEffect(() => {



        socket.on('send turn', (msg) => {
            if (msg.partida === codigo && msg.user !== usuario?.nombre) {
                console.log('turno remoto para mi:' + msg.turnoActual);
                setTurnoActual(msg.turnoActual);
                setDice(msg.dado);
                actualizarMensaje('Turno de: ' + msg.turnoActual);

                if (tableroRef.current) {
                    tableroRef.current.recibirDado(msg.dado);
                }

                if (tableroRef.current) {
                    tableroRef.current.recibirTurno(msg.turnoActual);//, false);
                }
            }
        });

        socket.on('send partida', (msg) => {
            if (msg.codigo === codigo) {
                console.log('cargando mi partida:' + msg.codigo);
                setTurnoActual(msg.current_turn);
                setDice(msg.dice);

                if (tableroRef.current) {
                    const posiciones = JSON.parse(msg.posiciones);
                    tableroRef.current.cambiarPosicionesDesdeSocket(posiciones);
                }

                if (tableroRef.current) {
                    tableroRef.current.recibirDado(msg.dice);
                }

                jugadores = msg.jugadores;
            }
        });

        socket.on('send mover ficha', (msg) => {
            if (msg.partida === codigo && msg.user !== usuario?.nombre) {
                console.log('movimiento remoto para mi: ' + msg.ficha);
                if (tableroRef.current) {
                    tableroRef.current.moverFichaDesdeSocket(msg.ficha, msg.nuevaPosicion);
                }
            }
        });

        socket.on('send cambiar posiciones', (msg) => {

            if (msg.partida === codigo && msg.user !== usuario?.nombre) {
                console.log('posiciones en remoto para mi por moviento ficha (' + msg.ficha + ') : ' + msg.posiciones);

                if (tableroRef.current) {
                    tableroRef.current.cambiarPosicionesDesdeSocket(msg.posiciones);
                }

                const hayOtroGanador = comprobarGanador(msg.posiciones);
                setHayGanador(hayOtroGanador);

            } else {
                console.log('posiciones recibidas: IGNORADO');
            }

        });

        return () => {
            socket.off('send turn');
            socket.off('send partida');
            socket.off('send mover ficha');
            socket.off('send cambiar posiciones');
        };
    }, []);

    const actualizarMensaje = (mensaje) => {
        setMensaje(mensaje);
    };



    const pasarTurno = (dado = null) => {

        console.log('pasando turno, jugadores: ' + jugadores);
        const nuevoTurno = (turnoActual === jugadores) ? 1 : (turnoActual + 1);

        //const nuevoTurno = (turnoActual % jugadores) + 1;
        setTurnoActual(nuevoTurno);

        if (tableroRef.current) {
            tableroRef.current.recibirTurno(nuevoTurno); //, false);
        }

        setUltimoDado(dado);
        setDice(null);
        actualizarMensaje("Nuevo turno: " + nuevoTurno);
        sendTurno(nuevoTurno, dado);
    };

    const sendTurno = (turno, dado) => {
        socket.emit('send turn', {
            partida: codigo,
            user: usuario?.nombre,
            turnoActual: turno,
            dado
        });
    };

    //    const sendMoverFicha = (ficha, anteriorPosicion, nuevaPosicion) => {
    //        socket.emit('send mover ficha', {
    //            partida: codigo,
    //            user: usuario?.nombre,
    //            ficha,
    //            anteriorPosicion,
    //            nuevaPosicion
    //        });
    //    };

    const onMoverFicha = (ficha, dado) => {
        //        sendMoverFicha(ficha, anteriorPosicion, nuevaPosicion);
        console.log('pasando turno, jugadores: ' + jugadores);
        pasarTurno(dado);
    };

    const onCambiarMensaje = (nuevoMensaje) => {
        actualizarMensaje(nuevoMensaje);
    };

    const nombresColores = ['Amarillo', 'Verde', 'Rojo', 'Azul'];
    const colores = ['#FFC107 ', 'green', 'red', 'blue'];


    function onCambiarPosiciones(fichaSeleccionada, posiciones, hayGanadorFinal) {

        sendCambiarPosiciones(fichaSeleccionada, posiciones);

        setHayGanador(hayGanadorFinal);

        if (hayGanadorFinal !== null) {
            actualizarMensaje("Ya hay ganador, el jugador: " + hayGanadorFinal);
        }
    }

    function sendCambiarPosiciones(fichaSeleccionada, posiciones) {
        const usuarioNombre = usuario?.nombre;

        console.log('enviando cambiar posiciones -  posiciones: ' + posiciones);

        socket.emit('send cambiar posiciones', { partida: codigo, user: usuarioNombre, ficha: fichaSeleccionada, posiciones });
    }


    const rollDice = async () => {
        if (hayGanador === null) {

            if ((numJugador === null && dice === null) || numJugador === turnoActual) {
                if (rolling)
                    return;
                setRolling(true);

                try {
                    const res = await axios.get(import.meta.env.VITE_BACKEND_HOST + '/roll');
                    setTimeout(() => {
                        const dado = res.data.number;

                        rollDiceManual(dado);

                        setRolling(false);

                    }, 500);
                } catch (err) {
                    console.error("Error al lanzar el dado:", err);
                    setRolling(false);
                }
            } else {
                if (numJugador === null && dice !== null) {
                    actualizarMensaje('No se puede tirar el dado 2 veces');
                }
                if (numJugador !== turnoActual) {
                    actualizarMensaje('No es tu turno');
                }
            }
        } else {
            onCambiarMensaje("Ya ha habido un ganador, el jugador: " + hayGanador + " . La partida ya ha terminado");
        }
    };

    const rollDiceManual = (dado) => {
        if (hayGanador === null) {
            try {

                if ((numJugador === null && dice === null) || numJugador === turnoActual) {

                    setDice(dado);
                    setUltimoDado(dado);

                    tableroRef.current.recibirDado(dado);

                    sendTurno(turnoActual, dado);

                    const movimientosJugador = tableroRef.current.verificarMovimientosPosibles(turnoActual, dado);
                    const movimientosPosibles = movimientosJugador.filter(mov => mov.puedeMover);
                    const cantidadDeMovimientos = movimientosPosibles.length;

                    if (cantidadDeMovimientos === 0) {
                        pasarTurno(dado);
                    } else if (cantidadDeMovimientos === 1) {
                        //                        tableroRef.current.recibirTurno(turnoActual, true);                         
                        tableroRef.current.seleccionarFichaPartida(movimientosPosibles[0].ficha, dado);
                    } else {
                        const nombresFichas = movimientosPosibles.map(m => m.ficha);
                        const nombresComoString = nombresFichas.map(nombre => nombre.charAt(6)).join(', ');
                        actualizarMensaje('Elige que ficha quieres mover: ' + nombresComoString);
                        //                        tableroRef.current.recibirTurno(turnoActual, true);                         
                    }
                } else {
                    if (numJugador === null && dice !== null) {
                        actualizarMensaje('No se puede tirar el dado 2 veces');
                    }
                    if (numJugador !== turnoActual) {
                        actualizarMensaje('No es tu turno');
                    }
                }

            } catch (err) {
                console.error("Error al lanzar el dado:", err);
                setRolling(false);
            }
        } else {
            onCambiarMensaje("Ya ha habido un ganador, el jugador: " + hayGanador + " . La partida ya ha terminado");
        }
    };

    const renderMensaje = () => (
        <div className="mensaje">
            {mensaje}
        </div>
    );

    const mostrarInfoPartida = (
        <h2 className="codigo-texto">
            {modo === 'CPU' ? (
                <>Modo: <span style={{ color: 'green' }}>VS CPU</span></>
            ) : (
                <>Código de Partida: <span>{codigo}</span></>
            )}
        </h2>
    );

    return (
        <div>
            <div className="mensajeContenedor" style={{ display: 'flex', justifyContent: 'center' }}>
                {renderMensaje()}
            </div>

            {modo === 'online' && (
                <div>
                    <div className="codigo-container">
                        {mostrarInfoPartida}
                    </div>
                    <div className="codigo-chat-wrapper">
                        <Chat socket={socket} codigo={codigo} usuario={usuario?.nombre} />
                    </div>
                </div>
            )}


            <div className="derecha-centro">
                <div className="turno-jugador">
                    Turno: <span style={{
                        color: colores[turnoActual - 1],
                        fontWeight: 'bold'
                    }}>
                        {nombresColores[turnoActual - 1]}
                    </span>
                </div>

                {DEBUG && (
                    <div style={{ float: "right" }} >
                        <button className="botonDadoDebug" onClick={() => rollDiceManual(1)}>1</button>
                        <button className="botonDadoDebug" onClick={() => rollDiceManual(2)}>2</button>
                        <button className="botonDadoDebug" onClick={() => rollDiceManual(3)}>3</button>
                        <button className="botonDadoDebug" onClick={() => rollDiceManual(4)}>4</button>
                        <button className="botonDadoDebug" onClick={() => rollDiceManual(5)}>5</button>
                        <button className="botonDadoDebug" onClick={() => rollDiceManual(6)}>6</button>

                    </div>
                )}
                <button
                    onClick={rollDice}
                    disabled={rolling}
                    className={`boton-dado ${rolling ? 'rodando' : ''}`}
                >
                    {rolling ? 'Rodando...' : 'Lanzar dado 🎲'}
                </button>

                {ultimoDado !== null && !rolling && (
                    <img
                        src={`/assets/images/dice-${ultimoDado}.png`}
                        alt={`Dado ${ultimoDado}`}
                        className="imagen-dado"
                    />
                )}

                <button className="custom-button" onClick={volverMenu}>
                    Volver
                </button>
            </div>
            {/* --- TABLERO --- */}
            <TableroParchis ref={tableroRef} onMoverFicha={onMoverFicha} onCambiarPosiciones={onCambiarPosiciones} onCambiarMensaje={onCambiarMensaje} numJugador={numJugador} />

        </div>
    );
}

export default Partida;

