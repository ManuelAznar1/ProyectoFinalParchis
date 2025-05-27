import React, { useEffect, useState, useRef } from 'react';
import './Partida.css';
import axios from 'axios';
import Chat from './Chat';
import TableroParchis from './TableroParchis';

function Partida( { volverMenu, codigo, usuario, modo, jugadores = 2, socket, numJugador }) {
    const [dice, setDice] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [turnoActual, setTurnoActual] = useState(1);
    const [mensaje, setMensaje] = useState('');
    const [dadoYaTirado, setDadoYaTirado] = useState(false);

    const tableroRef = useRef();

    const DEBUG = true;

    const coloresJugadores = {
        1: 'amarillo',
        2: 'verde',
        3: 'rojo',
        4: 'azul'
    };


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
                    tableroRef.current.recibirTurno(msg.turnoActual);
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
            tableroRef.current.recibirTurno(nuevoTurno);
        }

//        setDice(null);
        actualizarMensaje("Nuevo turno: " + nuevoTurno);
        sendTurno(nuevoTurno, dado);
        setDadoYaTirado(false);
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
        pasarTurno();
        setDadoYaTirado(false);
    };

    const onCambiarMensaje = (nuevoMensaje) => {
        actualizarMensaje(nuevoMensaje);
    };


    function onCambiarPosiciones(fichaSeleccionada, posiciones) {
        sendCambiarPosiciones(fichaSeleccionada, posiciones);
    }

    function sendCambiarPosiciones(fichaSeleccionada, posiciones) {
        const usuarioNombre = usuario?.nombre;

        console.log('enviando cambiar posiciones -  posiciones: ' + posiciones);

        socket.emit('send cambiar posiciones', {partida: codigo, user: usuarioNombre, ficha: fichaSeleccionada, posiciones});
    }


    const rollDice = async () => {
        
        if (!dadoYaTirado){        
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
        }else{
            actualizarMensaje('No se puede tirar el dado 2 veces');
        }
    };

    const rollDiceManual = (dado) => {

        try {

            if (!dadoYaTirado){

                setDadoYaTirado(true);
                setDice(dado);

                tableroRef.current.recibirDado(dado);

                sendTurno(turnoActual, dado);

                const movimientosJugador = tableroRef.current.verificarMovimientosPosibles(turnoActual, dado);
                const movimientosPosibles = movimientosJugador.filter(mov => mov.puedeMover);
                const cantidadDeMovimientos = movimientosPosibles.length;

                if (cantidadDeMovimientos === 0) {
                    pasarTurno(dado);
                } else if (cantidadDeMovimientos === 1) {
                    tableroRef.current.seleccionarFichaPartida(movimientosPosibles[0].ficha, dado);
                } else {
                    const nombresFichas = movimientosPosibles.map(m => m.ficha);
                    const nombresComoString = nombresFichas.join(', ');
                    actualizarMensaje('Elige que ficha quieres mover: ' + nombresComoString);
                }
            }else{
                actualizarMensaje('No se puede tirar el dado 2 veces');
            }

        } catch (err) {
            console.error("Error al lanzar el dado:", err);
            setRolling(false);
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
                                    <>Modo: <span style={{color: 'green'}}>VS CPU</span></>
                                    ) : (
                            <>Código de Partida: <span>{codigo}</span></>
                            )}
            </h2>
            );

    return (
            <div>
                <div className="mensajeContenedor" style={{display: 'flex', justifyContent: 'center'}}>
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
                        Turno: Jugador <span style={{
                                color: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'][turnoActual - 1],
                                fontWeight: 'bold'
                                                 }}>{turnoActual}</span>
                    </div>
            
                {DEBUG && (            
                    <div style={{float: "right"}} >
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
            
                    {dice && !rolling && (
                            <img
                                src={`/assets/images/dice-${dice}.png`}
                                alt={`Dado ${dice}`}
                                className="imagen-dado"
                                />
                                )}
            
                    <button className="custom-button" onClick={volverMenu}>
                        Volver
                    </button>
                </div>
                {/* --- TABLERO --- */}
                <TableroParchis ref={tableroRef} onMoverFicha={onMoverFicha} onCambiarPosiciones={onCambiarPosiciones} onCambiarMensaje={onCambiarMensaje} numJugador={numJugador}/>
            
            </div>
            );
}

export default Partida;

