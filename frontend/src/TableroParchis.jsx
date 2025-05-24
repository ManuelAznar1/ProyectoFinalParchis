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
                            display: "inline-block",
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
                        <td
                            className="amarillo"
                            colSpan={7}
                            rowSpan={7}
                            id="home-amarillo"
                            style={{ verticalAlign: "top", padding: "5px" }}
                        >
                            {renderFichasEnCelda("home-amarillo")}
                        </td>
                        <td colSpan={2} id="cell-1">1 {renderFichasEnCelda("cell-1")}</td>
                        <td colSpan={2} id="seguro-cell-68">O {renderFichasEnCelda("cell-68")}</td>
                        <td colSpan={2} id="cell-67">67 {renderFichasEnCelda("cell-67")}</td>
                        <td
                            className="verde"
                            colSpan={7}
                            rowSpan={7}
                            id="home-verde"
                            style={{ verticalAlign: "top", padding: "5px" }}
                        >
                            {renderFichasEnCelda("home-verde")}
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={2} id="cell-2">2 {renderFichasEnCelda("cell-2")}</td>
                        <td className="amarillo" colSpan={2} id="path-amarillo-1">- {renderFichasEnCelda("path-amarillo-1")}</td>
                        <td colSpan={2} id="cell-66">66 {renderFichasEnCelda("cell-66")}</td>
                    </tr>

                    <tr>
                        <td colSpan={2} id="cell-3">3 {renderFichasEnCelda("cell-3")}</td>
                        <td className="amarillo" colSpan={2} id="path-amarillo-2">- {renderFichasEnCelda("path-amarillo-2")}</td>
                        <td colSpan={2} id="cell-65">65 {renderFichasEnCelda("cell-65")}</td>
                    </tr>

                    <tr>
                        <td colSpan={2} id="cell-4">4 {renderFichasEnCelda("cell-4")}</td>
                        <td className="amarillo" colSpan={2} id="path-amarillo-3">- {renderFichasEnCelda("path-amarillo-3")}</td>
                        <td colSpan={2} id="cell-64">64 {renderFichasEnCelda("cell-64")}</td>
                    </tr>

                    <tr>
                        <td className="amarillo" colSpan={2} id="start-amarillo">5 {renderFichasEnCelda("start-amarillo")}</td>
                        <td className="amarillo" colSpan={2} id="path-amarillo-4">-{renderFichasEnCelda("path-amarillo-4")}</td>
                        <td colSpan={2} id="seguro-cell-63">O {renderFichasEnCelda("cell-63")}</td>
                    </tr>

                    <tr>
                        <td colSpan={2} id="cell-6">6 {renderFichasEnCelda("cell-6")}</td>
                        <td className="amarillo" colSpan={2} id="path-amarillo-5">- {renderFichasEnCelda("path-amarillo-5")}</td>
                        <td colSpan={2} id="cell-62">62 {renderFichasEnCelda("cell-62")}</td>
                    </tr>

                    <tr>
                        <td colSpan={2} id="cell-7">7 {renderFichasEnCelda("cell-7")}</td>
                        <td className="amarillo" colSpan={2} id="path-amarillo-6">- {renderFichasEnCelda("path-amarillo-6")}</td>
                        <td colSpan={2} id="cell-61">61 {renderFichasEnCelda("cell-61")}</td>
                    </tr>

                    <tr>
                        <td rowSpan={2} id="cell-16">16 {renderFichasEnCelda("cell-16")}</td>
                        <td rowSpan={2} id="cell-15">15 {renderFichasEnCelda("cell-15")}</td>
                        <td rowSpan={2} id="cell-14">14 {renderFichasEnCelda("cell-14")}</td>
                        <td rowSpan={2} id="cell-13">13 {renderFichasEnCelda("cell-13")}</td>
                        <td rowSpan={2} className="seguro" id="seguro-cell-12">O {renderFichasEnCelda("seguro-cell-12")}</td>
                        <td rowSpan={2} id="cell-11">11 {renderFichasEnCelda("cell-11")}</td>
                        <td rowSpan={2} id="cell-10">10 {renderFichasEnCelda("cell-10")}</td>
                        <td id="vacio"></td>
                        <td id="cell-8">8 {renderFichasEnCelda("cell-8")}</td>
                        <td className="amarillo" id="path-amarillo-7" >- {renderFichasEnCelda("path-amarillo-7")}</td>
                        <td className="amarillo">-</td>
                        <td id="cell-60">60 {renderFichasEnCelda("cell-60")}</td>
                        <td id="vacio"></td>
                        <td rowSpan={2} id="cell-58">58 {renderFichasEnCelda("cell-58")}</td>
                        <td rowSpan={2} id="cell-57">57 {renderFichasEnCelda("cell-57")}</td>
                        <td className="verde" rowSpan={2} id="start-verde">56{renderFichasEnCelda("start-verde")}</td>
                        <td rowSpan={2} id="cell-55">55 {renderFichasEnCelda("cell-55")}</td>
                        <td rowSpan={2} id="cell-54">54 {renderFichasEnCelda("cell-54")}</td>
                        <td rowSpan={2} id="cell-53">53 {renderFichasEnCelda("cell-53")}</td>
                        <td rowSpan={2} id="cell-52">52 {renderFichasEnCelda("cell-52")}</td>
                    </tr>

                    <tr>
                        <td id="cell-9">9 {renderFichasEnCelda("cell-9")}</td>
                        <td colSpan={4} rowSpan={4} id="center">CENTRO {renderFichasEnCelda("center")}</td>
                        <td id="cell-59">59 {renderFichasEnCelda("cell-59")}</td>
                    </tr>

                    <tr>
                        <td rowSpan={2} className="seguro" id="seguro-cell-17">O {renderFichasEnCelda("seguro-cell-17")}</td>
                        <td className="azul" rowSpan={2} id="path-azul-1">| {renderFichasEnCelda("path-azul-1")}</td>
                        <td className="azul" rowSpan={2} id="path-azul-2">| {renderFichasEnCelda("path-azul-2")}</td>
                        <td className="azul" rowSpan={2} id="path-azul-3">| {renderFichasEnCelda("path-azul-3")}</td>
                        <td className="azul" rowSpan={2} id="path-azul-4">| {renderFichasEnCelda("path-azul-4")}</td>
                        <td className="azul" rowSpan={2} id="path-azul-5">| {renderFichasEnCelda("path-azul-5")}</td>
                        <td className="azul" rowSpan={2} id="path-azul-6">| {renderFichasEnCelda("path-azul-6")}</td>
                        <td className="azul" id="path-azul-7">| {renderFichasEnCelda("path-azul-7")}</td>
                        <td className="verde" id="path-verde-7">| {renderFichasEnCelda("path-verde-7")}</td>
                        <td className="verde" rowSpan={2} id="path-verde-6">| {renderFichasEnCelda("path-verde-6")}</td>
                        <td className="verde" rowSpan={2} id="path-verde-5">| {renderFichasEnCelda("path-verde-5")}</td>
                        <td className="verde" rowSpan={2} id="path-verde-4">| {renderFichasEnCelda("path-verde-4")}</td>
                        <td className="verde" rowSpan={2} id="path-verde-3">| {renderFichasEnCelda("path-verde-3")}</td>
                        <td className="verde" rowSpan={2} id="path-verde-2">| {renderFichasEnCelda("path-verde-2")}</td>
                        <td className="verde" rowSpan={2} id="path-verde-1">| {renderFichasEnCelda("path-verde-1")}</td>
                        <td rowSpan={2} className="seguro" id="seguro-cell-51">O {renderFichasEnCelda("seguro-cell-51")}</td>
                    </tr>

                    <tr>
                        <td className="azul">|</td>
                        <td className="verde">|</td>
                    </tr>

                    <tr>
                        <td rowSpan={2} id="cell-18">18 {renderFichasEnCelda("cell-18")}</td>
                        <td rowSpan={2} id="cell-19">19 {renderFichasEnCelda("cell-19")}</td>
                        <td rowSpan={2} id="cell-20">20 {renderFichasEnCelda("cell-20")}</td>
                        <td rowSpan={2} id="cell-21">21 {renderFichasEnCelda("cell-21")}</td>
                        <td className="azul" rowSpan={2} id="start-azul">22 {renderFichasEnCelda("start-azul")}</td>
                        <td rowSpan={2} id="cell-23">23 {renderFichasEnCelda("cell-23")}</td>
                        <td rowSpan={2} id="cell-24">24 {renderFichasEnCelda("cell-24")}</td>
                        <td id="cell-25">25 {renderFichasEnCelda("cell-25")}</td>
                        <td id="cell-43">43 {renderFichasEnCelda("cell-43")}</td>
                        <td rowSpan={2} id="cell-44">44 {renderFichasEnCelda("cell-44")}</td>
                        <td rowSpan={2} id="cell-45">45 {renderFichasEnCelda("cell-45")}</td>
                        <td rowSpan={2} className="seguro" id="seguro-cell-46">O {renderFichasEnCelda("seguro-cell-46")}</td>
                        <td rowSpan={2} id="cell-47">47 {renderFichasEnCelda("cell-47")}</td>
                        <td rowSpan={2} id="cell-48">48 {renderFichasEnCelda("cell-48")}</td>
                        <td rowSpan={2} id="cell-49">49 {renderFichasEnCelda("cell-49")}</td>
                        <td rowSpan={2} id="cell-50">50 {renderFichasEnCelda("cell-50")}</td>
                    </tr>

                    <tr>
                        <td id="vacio"></td>
                        <td id="cell-26">26 {renderFichasEnCelda("cell-26")}</td>
                        <td className="rojo" id="path-rojo-7" >- {renderFichasEnCelda("path-rojo-7")}</td>
                        <td className="rojo" id="path-rojo-AA">-</td>
                        <td id="cell-42">42 {renderFichasEnCelda("cell-42")}</td>
                        <td id="vacio"></td>
                    </tr>

                    <tr>
                        <td
                            className="azul"
                            colSpan={7}
                            rowSpan={7}
                            id="home-azul"
                            style={{ verticalAlign: "top", padding: "5px" }}
                        >
                            {renderFichasEnCelda("home-azul")}
                        </td>
                        <td colSpan={2} id="cell-27">27 {renderFichasEnCelda("cell-27")}</td>
                        <td className="rojo" colSpan={2} id="path-rojo-6">- {renderFichasEnCelda("path-rojo-6")}</td>
                        <td colSpan={2} id="cell-41">41 {renderFichasEnCelda("cell-41")}</td>
                        <td
                            className="rojo"
                            colSpan={7}
                            rowSpan={7}
                            id="home-rojo"
                            style={{ verticalAlign: "top", padding: "5px" }}
                        >
                            {renderFichasEnCelda("home-rojo")}
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={2} id="cell-28">28 {renderFichasEnCelda("cell-28")}</td>
                        <td className="rojo" colSpan={2} id="path-rojo-5">- {renderFichasEnCelda("path-rojo-5")}</td>
                        <td colSpan={2} id="cell-40">40 {renderFichasEnCelda("cell-40")}</td>
                    </tr>

                    <tr>
                        <td colSpan={2} className="seguro" id="seguro-cell-29">O {renderFichasEnCelda("seguro-cell-29")}</td>
                        <td className="rojo" colSpan={2} id="path-rojo-4">- {renderFichasEnCelda("path-rojo-4")}</td>
                        <td className="rojo" colSpan={2} id="start-rojo">39 {renderFichasEnCelda("start-rojo")}</td>
                    </tr>

                    <tr>
                        <td colSpan={2} id="cell-30">30 {renderFichasEnCelda("cell-30")}</td>
                        <td className="rojo" colSpan={2} id="path-rojo-3">- {renderFichasEnCelda("path-rojo-3")}</td>
                        <td colSpan={2} id="cell-38">38 {renderFichasEnCelda("cell-38")}</td>
                    </tr>

                    <tr>
                        <td colSpan={2} id="cell-31">31 {renderFichasEnCelda("cell-31")}</td>
                        <td className="rojo" colSpan={2} id="path-rojo-2">- {renderFichasEnCelda("path-rojo-2")}</td>
                        <td colSpan={2} id="cell-37">37 {renderFichasEnCelda("cell-37")}</td>
                    </tr>

                    <tr>
                        <td colSpan={2} id="cell-32">32 {renderFichasEnCelda("cell-32")}</td>
                        <td className="rojo" colSpan={2} id="path-rojo-1">- {renderFichasEnCelda("path-rojo-1")}</td>
                        <td colSpan={2} id="cell-36">36 {renderFichasEnCelda("cell-36")}</td>
                    </tr>

                    <tr>
                        <td colSpan={2} id="cell-33">33 {renderFichasEnCelda("cell-33")}</td>
                        <td colSpan={2} className="seguro" id="seguro-cell-34">O {renderFichasEnCelda("seguro-cell-34")}</td>
                        <td colSpan={2} id="cell-35">35 {renderFichasEnCelda("cell-35")}</td>
                    </tr>
                </tbody>
            </table>


        </>
    );
});

export default TableroParchis;
