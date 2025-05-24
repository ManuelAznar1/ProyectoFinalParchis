import React, { useEffect, useState, useRef } from 'react';
import './Partida.css';
import axios from 'axios';
import Chat from './Chat';
import TableroParchis from './TableroParchis';

function Partida({ volverMenu, codigo, usuario, modo, jugadores = 2, socket }) {
    const [dice, setDice] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [turnoActual, setTurnoActual] = useState(1);
//    const [puedeMover, setPuedeMover] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const tableroRef = useRef();

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
                actualizar(msg.turnoActual);

                if (tableroRef.current) {
                    tableroRef.current.recibirDado(msg.dado);
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
                console.log('posiciones en remoto para mi por moviento ficha ('+msg.ficha+') : ' + msg.posiciones);

                if (tableroRef.current) {
                    tableroRef.current.cambiarPosicionesDesdeSocket(msg.posiciones);
                }

                // TODO Aqui habria como mover la ficha del tablero
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
        const nuevoTurno = (turnoActual % jugadores) + 1;
        setTurnoActual(nuevoTurno);
        setDice(null);
//        setPuedeMover(false);
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

    const sendMoverFicha = (ficha, anteriorPosicion, nuevaPosicion) => {
        socket.emit('send mover ficha', {
            partida: codigo,
            user: usuario?.nombre,
            ficha,
            anteriorPosicion,
            nuevaPosicion
        });
    };

    const onMoverFicha = (ficha, anteriorPosicion, nuevaPosicion) => {
        sendMoverFicha(ficha, anteriorPosicion, nuevaPosicion);
        pasarTurno();
    };

    const onCambiarMensaje = (nuevoMensaje) => {
        actualizarMensaje(nuevoMensaje);   
    };

/*    
    const verificarMovimientosPosibles = (dado) => {
        const fichasJugador = tableroRef.current?.obtenerFichasJugador(turnoActual);
        const tablero = tableroRef.current?.estadoTablero;

        if (!fichasJugador || !tablero) return false;

        socket.emit('send mover ficha', { partida: codigo, user: usuarioNombre, ficha, anteriorPosicion, nuevaPosicion });
    }
 */

    function onCambiarPosiciones(fichaSeleccionada, posiciones) {
        sendCambiarPosiciones(fichaSeleccionada, posiciones);
    }

    function sendCambiarPosiciones(fichaSeleccionada, posiciones) {
        const usuarioNombre = usuario?.nombre;

        console.log('enviando cambiar posiciones -  posiciones: ' + posiciones);

        socket.emit('send cambiar posiciones', { partida: codigo, user: usuarioNombre, ficha: fichaSeleccionada, posiciones });
    }    

    const rollDice = async () => {
        if (rolling) return;
        setRolling(true);

        try {
            const res = await axios.get(import.meta.env.VITE_BACKEND_HOST + '/roll');
            setTimeout(() => {
                const dado = res.data.number;
                setDice(dado);

                if (tableroRef.current) {
                    tableroRef.current.recibirDado(dado);
                }
/*
                const hayMovimientos = verificarMovimientosPosibles(dado);
                setPuedeMover(hayMovimientos);

                if (!hayMovimientos) {
                    pasarTurno(dado);
                }
*/
                const nuevoTurno = (turnoActual === jugadores) ? 1 : (turnoActual + 1);
                setTurnoActual(nuevoTurno);

                sendTurno(nuevoTurno, dado);

                setRolling(false);
            }, 500);
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
                <>Modo: <span style={{ color: 'green' }}>VS CPU</span></>
            ) : (
                <>Código de Partida: <span>{codigo}</span></>
            )}
        </h2>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            <TableroParchis ref={tableroRef} onMoverFicha={onMoverFicha} onCambiarPosiciones={onCambiarPosiciones} onCambiarMensaje={onCambiarMensaje}/>

        </div>
    );
}

export default Partida;

