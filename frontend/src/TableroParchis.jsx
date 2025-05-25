import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import "./TableroParchis.css";
import { posicionesIniciales, moverFichaTablero, esMiTurno } from "./logicaParchis";


const TableroParchis = forwardRef(({ onMoverFicha, onCambiarPosiciones, onCambiarMensaje }, ref) => {
    const [posiciones, setPosiciones] = useState(posicionesIniciales);
    const [dado, setDado] = useState(null);
    const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
    const [turnoActual, setTurnoActual] = useState(1);


    useImperativeHandle(ref, () => ({
        recibirDado(valor) {
            console.log("Recibido en TableroParchis:", valor);
            setDado(valor);
            setFichaSeleccionada(null);
        },

        recibirTurno(turnoJugador) {
            console.log("Recibido en TablerooParchis turno:", turnoJugador);
            setTurnoActual(turnoJugador);
        },

        cambiarPosicionesDesdeSocket(posiciones) {
            console.log("Recibido en Tablero Parchis posiciones:", posiciones);
            setPosiciones(posiciones);
        },

        moverFichaDesdeSocket(fichaSeleccionada, posicion) {
            console.log("Recibido en TableroParchis - ficha: " + fichaSeleccionada + " , posicion: " + posicion);
            //      setFichaSeleccionada(idFicha);
            let recorridoTablero = recorridoTableroAmarillo;
            if (fichaSeleccionada.startsWith("ficha4")) {
                recorridoTablero = recorridoTableroAzul;
            } else if (fichaSeleccionada.startsWith("ficha3")) {
                recorridoTablero = recorridoTableroRojo;
            } else if (fichaSeleccionada.startsWith("ficha2")) {
                recorridoTablero = recorridoTableroVerde;
            }

            const posActual = posiciones[fichaSeleccionada];
            const indiceActual = recorridoTablero.indexOf(posActual);

            let indiceNuevo = posicion;

            if (indiceNuevo >= recorridoTablero.length) {
                indiceNuevo = recorridoTablero.length - 1;
            }

            console.log('Movimiento Remoto: indiceActual=' + indiceActual + ', dado=' + dado + ' --> indiceNuevo=' + indiceNuevo);

            const nuevaPos = recorridoTablero[indiceNuevo];
            console.log('fichaSeleccionada: ' + fichaSeleccionada + ', nuevaPos:' + nuevaPos);

            setPosiciones({
                ...posiciones,
                [fichaSeleccionada]: nuevaPos,
            });

            setDado(null);
            setFichaSeleccionada(null);

        }
    }));

    useEffect(() => {
        console.log("Posiciones actualizadas:", posiciones);
    }, [posiciones]);


    function tirarDado() {
        const valor = Math.floor(Math.random() * 6) + 1;
        setDado(valor);
        setFichaSeleccionada(null);
    }

    function seleccionarFicha(idFicha) {
        if (esMiTurno(idFicha, turnoActual)) {


            //if ()
            setFichaSeleccionada(idFicha);
            moverFichaLocal(idFicha);


        } else {
            onCambiarMensaje("No es tu turno para mover esta ficha");
        }
    }

    function moverFichaLocal(fichaSeleccionada) {
        if (!fichaSeleccionada) {
            onCambiarMensaje("Selecciona una ficha para mover");
            return;
        }
        if (!dado) {
            onCambiarMensaje("Tira el dado antes de mover");
            return;
        }

        let posicionesNuevas = moverFichaTablero(posiciones, fichaSeleccionada, dado);

        setPosiciones(posicionesNuevas);

        console.log('posiciones a mandar: ' + posicionesNuevas);

        onCambiarPosiciones(fichaSeleccionada, posicionesNuevas);

        setDado(null);
        setFichaSeleccionada(null);


    }

    function renderFichasEnCelda(idCelda) {
        const fichasEnCelda = Object.entries(posiciones)
            .filter(([_, celda]) => celda === idCelda)
            .map(([fichaId]) => {
                const colorMap = {
                    ficha1: "amarillo",
                    ficha2: "verde",
                    ficha3: "rojo",
                    ficha4: "azul",
                };
                const color = colorMap[fichaId.slice(0, 6)] || "gris";

                return (
                    <span
                        key={fichaId}
                        id={fichaId}
                        className={`ficha ${color}`}
                        onClick={() => seleccionarFicha(fichaId)}
                        style={{
                            cursor: "pointer",
                            border: fichaSeleccionada === fichaId ? "2px solid black" : "none",
                            margin: "2px",
                            padding: "4px",
                            borderRadius: "50%",
                            display: "inline",
                            backgroundColor: color,
                            color: "white",
                            userSelect: "none",
                            fontWeight: "bold",
                        }}
                    >
                        {fichaId.slice(-1)}
                    </span>
                );
            });
        return fichasEnCelda.length ? fichasEnCelda : null;
    }



    return (
        <>
            <div style={{ float: "right" }}>
                {dado !== null && <span style={{ marginLeft: "1em" }}>Dado: {dado}</span>}
                <button onClick={() => setDado(1)}>1</button>
                <button onClick={() => setDado(2)}>2</button>
                <button onClick={() => setDado(3)}>3</button>
                <button onClick={() => setDado(4)}>4</button>
                <button onClick={() => setDado(5)}>5</button>
                <button onClick={() => setDado(6)}>6</button>

            </div>


<table border="1">
  <tbody>
    <tr>
      <td className="amarillo" colSpan={7} rowSpan={7} id="home-amarillo" style={{ verticalAlign: "top", padding: "5px" }}>
        {renderFichasEnCelda("home-amarillo")}
      </td>
      <td colSpan={2} id="cell-1" className="horizontal"><span className="numero">1</span> {renderFichasEnCelda("cell-1")}</td>
      <td colSpan={2} className="seguro horizontal" id="seguro-cell-68"><span className="numero">O</span> {renderFichasEnCelda("cell-68")}</td>
      <td colSpan={2} id="cell-67" className="horizontal"><span className="numero">67</span> {renderFichasEnCelda("cell-67")}</td>
      <td className="verde" colSpan={7} rowSpan={7} id="home-verde" style={{ verticalAlign: "top", padding: "5px" }}>
        {renderFichasEnCelda("home-verde")}
      </td>
    </tr>

    <tr>
      <td colSpan={2} id="cell-2" className="horizontal"><span className="numero">2</span> {renderFichasEnCelda("cell-2")}</td>
      <td className="amarillo horizontal" colSpan={2} id="path-amarillo-1"><span className="numero">-</span> {renderFichasEnCelda("path-amarillo-1")}</td>
      <td colSpan={2} id="cell-66" className="horizontal"><span className="numero">66</span> {renderFichasEnCelda("cell-66")}</td>
    </tr>

    <tr>
      <td colSpan={2} id="cell-3" className="horizontal"><span className="numero">3</span> {renderFichasEnCelda("cell-3")}</td>
      <td className="amarillo horizontal" colSpan={2} id="path-amarillo-2"><span className="numero">-</span> {renderFichasEnCelda("path-amarillo-2")}</td>
      <td colSpan={2} id="cell-65" className="horizontal"><span className="numero">65</span> {renderFichasEnCelda("cell-65")}</td>
    </tr>

    <tr>
      <td colSpan={2} id="cell-4" className="horizontal"><span className="numero">4</span> {renderFichasEnCelda("cell-4")}</td>
      <td className="amarillo horizontal" colSpan={2} id="path-amarillo-3"><span className="numero">-</span> {renderFichasEnCelda("path-amarillo-3")}</td>
      <td colSpan={2} id="cell-64" className="horizontal"><span className="numero">64</span> {renderFichasEnCelda("cell-64")}</td>
    </tr>

    <tr>
      <td className="amarillo horizontal" colSpan={2} id="start-amarillo"><span className="numero">5</span> {renderFichasEnCelda("start-amarillo")}</td>
      <td className="amarillo horizontal" colSpan={2} id="path-amarillo-4"><span className="numero">-</span> {renderFichasEnCelda("path-amarillo-4")}</td>
      <td colSpan={2} className="seguro horizontal" id="seguro-cell-63"><span className="numero">O</span> {renderFichasEnCelda("cell-63")}</td>
    </tr>

    <tr>
      <td colSpan={2} id="cell-6" className="horizontal"><span className="numero">6</span> {renderFichasEnCelda("cell-6")}</td>
      <td className="amarillo horizontal" colSpan={2} id="path-amarillo-5"><span className="numero">-</span> {renderFichasEnCelda("path-amarillo-5")}</td>
      <td colSpan={2} id="cell-62" className="horizontal"><span className="numero">62</span> {renderFichasEnCelda("cell-62")}</td>
    </tr>

    <tr>
      <td colSpan={2} id="cell-7" className="horizontal"><span className="numero">7</span> {renderFichasEnCelda("cell-7")}</td>
      <td className="amarillo horizontal" colSpan={2} id="path-amarillo-6"><span className="numero">-</span> {renderFichasEnCelda("path-amarillo-6")}</td>
      <td colSpan={2} id="cell-61" className="horizontal"><span className="numero">61</span> {renderFichasEnCelda("cell-61")}</td>
    </tr>

    <tr>
      <td rowSpan={2} id="cell-16" className="vertical"><span className="celda vertical left-column numero">16</span> {renderFichasEnCelda("cell-16")}</td>
      <td rowSpan={2} id="cell-15" className="vertical"><span className="celda vertical left-column numero">15</span> {renderFichasEnCelda("cell-15")}</td>
      <td rowSpan={2} id="cell-14" className="vertical"><span className="celda vertical left-column numero">14</span> {renderFichasEnCelda("cell-14")}</td>
      <td rowSpan={2} id="cell-13" className="vertical"><span className="celda vertical left-column numero">13</span> {renderFichasEnCelda("cell-13")}</td>
      <td rowSpan={2} id="seguro-cell-12" className="vertical"><span className="celda vertical left-column numero">O</span> {renderFichasEnCelda("seguro-cell-12")}</td>
      <td rowSpan={2} id="cell-11" className="vertical"><span className="celda vertical left-column numero">11</span> {renderFichasEnCelda("cell-11")}</td>
      <td rowSpan={2} id="cell-10" className="vertical"><span className="celda vertical left-column numero">10</span> {renderFichasEnCelda("cell-10")}</td>
      <td id="vacio"></td>
      <td id="cell-8" className="horizontal"><span className="numero">8</span> {renderFichasEnCelda("cell-8")}</td>
      <td className="amarillo horizontal" id="path-amarillo-7"><span className="numero">-</span> {renderFichasEnCelda("path-amarillo-7")}</td>
      <td className="amarillo horizontal"><span className="numero">-</span></td>
      <td id="cell-60" className="horizontal"><span className="numero">60</span> {renderFichasEnCelda("cell-60")}</td>
      <td id="vacio"></td>
      <td rowSpan={2} id="cell-58" className="vertical"><span className="celda vertical right-column numero">58</span> {renderFichasEnCelda("cell-58")}</td>
      <td rowSpan={2} id="cell-57" className="vertical"><span className="celda vertical right-column numero">57</span> {renderFichasEnCelda("cell-57")}</td>
      <td rowSpan={2} id="start-verde" className="vertical"><span className="celda vertical right-column numero">56</span> {renderFichasEnCelda("start-verde")}</td>
      <td rowSpan={2} id="cell-55" className="vertical"><span className="celda vertical right-column numero">55</span> {renderFichasEnCelda("cell-55")}</td>
      <td rowSpan={2} id="cell-54" className="vertical"><span className="celda vertical right-column numero">54</span> {renderFichasEnCelda("cell-54")}</td>
      <td rowSpan={2} id="cell-53" className="vertical"><span className="celda vertical right-column numero">53</span> {renderFichasEnCelda("cell-53")}</td>
      <td rowSpan={2} id="cell-52" className="vertical"><span className="celda vertical right-column numero">52</span> {renderFichasEnCelda("cell-52")}</td>
    </tr>

    <tr>
      <td id="cell-9"><span className="celda vertical left-column numero">9</span> {renderFichasEnCelda("cell-9")}</td>
      <td colSpan={4} rowSpan={4} id="center"><span>CENTRO</span> {renderFichasEnCelda("center")}</td>
      <td id="cell-59"><span className="celda vertical right-column numero">59</span> {renderFichasEnCelda("cell-59")}</td>
    </tr>

    <tr>
      <td rowSpan={2} className="seguro vertical" id="seguro-cell-17"><span className="numero">O</span> {renderFichasEnCelda("seguro-cell-17")}</td>
      <td className="azul horizontal" rowSpan={2} id="path-azul-1"><span className="numero">|</span> {renderFichasEnCelda("path-azul-1")}</td>
      <td className="azul horizontal" rowSpan={2} id="path-azul-2"><span className="numero">|</span> {renderFichasEnCelda("path-azul-2")}</td>
      <td className="azul horizontal" rowSpan={2} id="path-azul-3"><span className="numero">|</span> {renderFichasEnCelda("path-azul-3")}</td>
      <td className="azul horizontal" rowSpan={2} id="path-azul-4"><span className="numero">|</span> {renderFichasEnCelda("path-azul-4")}</td>
      <td className="azul horizontal" rowSpan={2} id="path-azul-5"><span className="numero">|</span> {renderFichasEnCelda("path-azul-5")}</td>
      <td className="azul horizontal" rowSpan={2} id="path-azul-6"><span className="numero">|</span> {renderFichasEnCelda("path-azul-6")}</td>
      <td className="azul horizontal" id="path-azul-7"><span className="numero">|</span> {renderFichasEnCelda("path-azul-7")}</td>
      <td className="verde horizontal" id="path-verde-7"><span className="numero">|</span> {renderFichasEnCelda("path-verde-7")}</td>
      <td className="verde horizontal" rowSpan={2} id="path-verde-6"><span className="numero">|</span> {renderFichasEnCelda("path-verde-6")}</td>
      <td className="verde horizontal" rowSpan={2} id="path-verde-5"><span className="numero">|</span> {renderFichasEnCelda("path-verde-5")}</td>
      <td className="verde horizontal" rowSpan={2} id="path-verde-4"><span className="numero">|</span> {renderFichasEnCelda("path-verde-4")}</td>
      <td className="verde horizontal" rowSpan={2} id="path-verde-3"><span className="numero">|</span> {renderFichasEnCelda("path-verde-3")}</td>
      <td className="verde horizontal" rowSpan={2} id="path-verde-2"><span className="numero">|</span> {renderFichasEnCelda("path-verde-2")}</td>
      <td className="verde horizontal" rowSpan={2} id="path-verde-1"><span className="numero">|</span> {renderFichasEnCelda("path-verde-1")}</td>
      <td rowSpan={2} className="seguro vertical" id="seguro-cell-51"><span className="numero">O</span> {renderFichasEnCelda("seguro-cell-51")}</td>
    </tr>

    <tr>
      <td className="azul"><span className="numero">|</span></td>
      <td className="verde"><span className="numero">|</span></td>
    </tr>

    <tr>
      <td rowSpan={2} id="cell-18"><span className="celda vertical left-column numero">18</span> {renderFichasEnCelda("cell-18")}</td>
      <td rowSpan={2} id="cell-19"><span className="celda vertical left-column numero">19</span> {renderFichasEnCelda("cell-19")}</td>
      <td rowSpan={2} id="cell-20"><span className="celda vertical left-column numero">20</span> {renderFichasEnCelda("cell-20")}</td>
      <td rowSpan={2} id="cell-21"><span className="celda vertical left-column numero">21</span> {renderFichasEnCelda("cell-21")}</td>
      <td className="azul" rowSpan={2} id="start-azul"><span className="celda vertical left-column numero">22</span> {renderFichasEnCelda("start-azul")}</td>
      <td rowSpan={2} id="cell-23"><span className="celda vertical left-column numero">23</span> {renderFichasEnCelda("cell-23")}</td>
      <td rowSpan={2} id="cell-24"><span className="celda vertical left-column numero">24</span> {renderFichasEnCelda("cell-24")}</td>
      <td id="cell-25"><span className="celda vertical left-column numero">25</span> {renderFichasEnCelda("cell-25")}</td>
      <td id="cell-43"><span className="celda vertical right-column numero">43</span> {renderFichasEnCelda("cell-43")}</td>
      <td rowSpan={2} id="cell-44"><span className="celda vertical right-column numero">44</span> {renderFichasEnCelda("cell-44")}</td>
      <td rowSpan={2} id="cell-45"><span className="celda vertical right-column numero">45</span> {renderFichasEnCelda("cell-45")}</td>
      <td rowSpan={2} className="seguro vertical" id="seguro-cell-46"><span className="celda vertical right-column numero">O</span> {renderFichasEnCelda("seguro-cell-46")}</td>
      <td rowSpan={2} id="cell-47"><span className="celda vertical right-column numero">47</span> {renderFichasEnCelda("cell-47")}</td>
      <td rowSpan={2} id="cell-48"><span className="celda vertical right-column numero">48</span> {renderFichasEnCelda("cell-48")}</td>
      <td rowSpan={2} id="cell-49"><span className="celda vertical right-column numero">49</span> {renderFichasEnCelda("cell-49")}</td>
      <td rowSpan={2} id="cell-50"><span className="celda vertical right-column numero">50</span> {renderFichasEnCelda("cell-50")}</td>
    </tr>

    <tr>
      <td id="vacio"></td>
      <td id="cell-26" className="horizontal"><span className="numero">26</span> {renderFichasEnCelda("cell-26")}</td>
      <td className="rojo horizontal" id="path-rojo-7"><span className="numero">-</span> {renderFichasEnCelda("path-rojo-7")}</td>
      <td className="rojo horizontal" id="path-rojo-AA"><span className="numero">-</span></td>
      <td id="cell-42" className="horizontal"><span className="numero">42</span> {renderFichasEnCelda("cell-42")}</td>
      <td id="vacio"></td>
    </tr>

    <tr>
      <td className="azul" colSpan={7} rowSpan={7} id="home-azul" style={{ verticalAlign: "top", padding: "5px" }}>
        {renderFichasEnCelda("home-azul")}
      </td>
      <td colSpan={2} id="cell-27" className="horizontal"><span className="numero">27</span> {renderFichasEnCelda("cell-27")}</td>
      <td className="rojo horizontal" colSpan={2} id="path-rojo-6"><span className="numero">-</span> {renderFichasEnCelda("path-rojo-6")}</td>
      <td colSpan={2} id="cell-41" className="horizontal"><span className="numero">41</span> {renderFichasEnCelda("cell-41")}</td>
      <td className="rojo" colSpan={7} rowSpan={7} id="home-rojo" style={{ verticalAlign: "top", padding: "5px" }}>
        {renderFichasEnCelda("home-rojo")}
      </td>
    </tr>

    <tr>
      <td colSpan={2} id="cell-28" className="horizontal"><span className="numero">28</span> {renderFichasEnCelda("cell-28")}</td>
      <td className="rojo horizontal" colSpan={2} id="path-rojo-5"><span className="numero">-</span> {renderFichasEnCelda("path-rojo-5")}</td>
      <td colSpan={2} id="cell-40" className="horizontal"><span className="numero">40</span> {renderFichasEnCelda("cell-40")}</td>
    </tr>

    <tr>
      <td colSpan={2} className="seguro horizontal" id="seguro-cell-29"><span className="numero">O</span> {renderFichasEnCelda("seguro-cell-29")}</td>
      <td className="rojo horizontal" colSpan={2} id="path-rojo-4"><span className="numero">-</span> {renderFichasEnCelda("path-rojo-4")}</td>
      <td className="rojo horizontal" colSpan={2} id="start-rojo"><span className="numero">39</span> {renderFichasEnCelda("start-rojo")}</td>
    </tr>

    <tr>
      <td colSpan={2} id="cell-30" className="horizontal"><span className="numero">30</span> {renderFichasEnCelda("cell-30")}</td>
      <td className="rojo horizontal" colSpan={2} id="path-rojo-3"><span className="numero">-</span> {renderFichasEnCelda("path-rojo-3")}</td>
      <td colSpan={2} id="cell-38" className="horizontal"><span className="numero">38</span> {renderFichasEnCelda("cell-38")}</td>
    </tr>

    <tr>
      <td colSpan={2} id="cell-31" className="horizontal"><span className="numero">31</span> {renderFichasEnCelda("cell-31")}</td>
      <td className="rojo horizontal" colSpan={2} id="path-rojo-2"><span className="numero">-</span> {renderFichasEnCelda("path-rojo-2")}</td>
      <td colSpan={2} id="cell-37" className="horizontal"><span className="numero">37</span> {renderFichasEnCelda("cell-37")}</td>
    </tr>

    <tr>
      <td colSpan={2} id="cell-32" className="horizontal"><span className="numero">32</span> {renderFichasEnCelda("cell-32")}</td>
      <td className="rojo horizontal" colSpan={2} id="path-rojo-1"><span className="numero">-</span> {renderFichasEnCelda("path-rojo-1")}</td>
      <td colSpan={2} id="cell-36" className="horizontal"><span className="numero">36</span> {renderFichasEnCelda("cell-36")}</td>
    </tr>

    <tr>
      <td colSpan={2} id="cell-33" className="horizontal"><span className="numero">33</span> {renderFichasEnCelda("cell-33")}</td>
      <td colSpan={2} className="seguro horizontal" id="seguro-cell-34"><span className="numero">O</span> {renderFichasEnCelda("seguro-cell-34")}</td>
      <td colSpan={2} id="cell-35" className="horizontal"><span className="numero">35</span> {renderFichasEnCelda("cell-35")}</td>
    </tr>
  </tbody>
</table>


        </>
    );
});

export default TableroParchis;
