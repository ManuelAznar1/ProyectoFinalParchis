import React, { useEffect, useState, useRef } from 'react';
import './Partida.css';
import axios from 'axios';
import Chat from './Chat';
import TableroParchis from './TableroParchis';

function Partida({ volverMenu, codigo, usuario, modo, jugadores = 2, socket }) {
    const [dice, setDice] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [turnoActual, setTurnoActual] = useState(1);
    const tableroRef = useRef();

    useEffect(() => {

        socket.on('send turn', (msg) => {

            if (msg.partida === codigo && msg.user !== usuario?.nombre) {
                console.log('turno remoto para mi:' + msg.turnoActual);

                setTurnoActual(msg.turnoActual);
                setDice(msg.dado);
            } else {
                console.log('turno remoto: IGNORADO');
            }

        });

        socket.on('send partida', (msg) => {

            console.log('msg.codigo:' + msg.codigo + ' - codigo: ' + codigo);

            if (msg.codigo === codigo) {
                console.log('cargando mi partida:' + msg.codigo);

                setTurnoActual(msg.current_turn);
                setDice(msg.dice);


            } else {
                console.log('partida remoto: IGNORADO');
            }

        });


        socket.on('send mover ficha', (msg) => {

            if (msg.partida === codigo && msg.user !== usuario?.nombre) {
                console.log('movimiento remoto para mi: ' + msg.ficha);

                if (tableroRef.current) {
                    tableroRef.current.moverFichaDesdeSocket(msg.ficha, msg.nuevaPosicion);
                }

                // TODO Aqui habria como mover la ficha del tablero
            } else {
                console.log('movimiento remoto: IGNORADO');
            }

        });

        return () => {
            socket.off('send turn');
            socket.off('send partida');
            socket.off('send mover ficha');

        };
    }, []);

    function sendTurno(turno, dado) {
        const usuarioNombre = usuario?.nombre;

        console.log('enviando turno: ' + turno);

        socket.emit('send turn', { partida: codigo, user: usuarioNombre, turnoActual: turno, dado });
    }


    function onMoverFicha(ficha, anteriorPosicion, nuevaPosicion) {
        sendMoverFicha(ficha, anteriorPosicion, nuevaPosicion);
    }

    function sendMoverFicha(ficha, anteriorPosicion, nuevaPosicion) {
        const usuarioNombre = usuario?.nombre;

        console.log('enviando movimiento ficha: ' + ficha + ', anteriorPosicion: ' + anteriorPosicion + ', nuevaPosicion: ' + nuevaPosicion);

        socket.emit('send mover ficha', { partida: codigo, user: usuarioNombre, ficha, anteriorPosicion, nuevaPosicion });
    }

    const rollDice = async () => {
        setRolling(true);
        try {
            const res = await axios.get(import.meta.env.VITE_BACKEND_HOST + '/roll');
            setTimeout(() => {

                const dado = res.data.number;
                setDice(dado);

                if (tableroRef.current) {
                    tableroRef.current.recibirDado(dado);
                }


                // TODO Aqui habra que gestionar como se cambia el turno, ya que si no se puede mover se cambia de turno
                // Pero si se puede mover se cambia de turno despues de que mueva
                // HAbra que hacer un metodo que valide si ese jugador con ese dado puede mover

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

            {
                <Chat socket={socket} codigo={codigo} usuario={usuario?.nombre} />
            }

            <div className="codigo-container" style={{ textAlign: 'center' }}>
                {mostrarInfoPartida}
            </div>

            {/* Contenedor dado + botón Volver a la derecha, centrado verticalmente */}
            <div className="derecha-centro">
                {/* Añadido el turno aquí */}
                <div className="turno-jugador">
                    Turno: Jugador <span style={{
                        color: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'][turnoActual - 1],
                        fontWeight: 'bold'
                    }}>{turnoActual}</span>
                </div>

                <button onClick={rollDice} disabled={rolling}>
                    {rolling ? 'Rodando...' : 'Lanzar dado 🎲'}
                </button>

                {dice && !rolling && (
                    <img src={`/assets/images/dice-${dice}.png`} alt={`Dado ${dice}`} />
                )}

                <button className="custom-button" onClick={volverMenu}>
                    Volver
                </button>
            </div>
            {/* --- TABLERO --- */}
            <TableroParchis ref={tableroRef} onMoverFicha={onMoverFicha} />
        </div>
    );
}

export default Partida;