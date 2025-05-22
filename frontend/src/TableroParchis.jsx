import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import "./TableroParchis.css"; // Asumiendo que tendrás aquí los estilos



const posicionesIniciales = {
    ficha11: "home-amarillo",
    ficha12: "home-amarillo",
    ficha13: "home-amarillo",
    ficha14: "home-amarillo",
    ficha21: "home-verde",
    ficha22: "home-verde",
    ficha23: "home-verde",
    ficha24: "home-verde",
    ficha31: "home-rojo",
    ficha32: "home-rojo",
    ficha33: "home-rojo",
    ficha34: "home-rojo",
    ficha41: "home-azul",
    ficha42: "home-azul",
    ficha43: "home-azul",
    ficha44: "home-azul",
};

// Recorrido completo del tablero en orden (simplificado, añadir según tu diseño)
const recorridoTableroAmarillo = [
    // Amarillo empieza aquí
    "start-amarillo",
    "cell-6",
    "cell-7",
    "cell-8",
    "cell-9",
    "cell-10",
    "cell-11",
    "cell-12",
    "cell-13",
    "cell-14",
    "cell-15",
    "cell-16",
    "cell-17",
    "cell-18",
    "cell-19",
    "cell-20",
    "cell-21",
    "start-azul",
    "cell-23",
    "cell-24",
    "cell-25",
    "cell-26",
    "cell-27",
    "cell-28",
    "cell-29",
    "cell-30",
    "cell-31",
    "cell-32",
    "cell-33",
    "cell-34",
    "cell-35",
    "cell-36",
    "cell-37",
    "cell-38",
    "start-rojo",

    "cell-40",
    "cell-41",
    "cell-42",
    "cell-43",
    "cell-44",
    "cell-45",
    "cell-46",

    "cell-47",
    "cell-48",
    "cell-49",
    "cell-50",
    "cell-51",
    "cell-52",
    "cell-53",
    "cell-54",
    "cell-55",
    "start-verde",
    "cell-57",
    "cell-58",
    "cell-59",
    "cell-60",

    "cell-61",
    "cell-62",
    "cell-63",
    "cell-64",
    "cell-65",
    "cell-66",
    "cell-67",
    "cell-68",

    "path-amarillo-1",
    "path-amarillo-2",
    "path-amarillo-3",
    "path-amarillo-4",
    "path-amarillo-5",
    "path-amarillo-6",
    "path-amarillo-7",
    "center"
];

// Recorrido completo del tablero en orden (simplificado, añadir según tu diseño)
const recorridoTableroAzul = [
    // Amarillo empieza aquí
    "start-azul",
    "cell-23",
    "cell-24",
    "cell-25",
    "cell-26",
    "cell-27",
    "cell-28",
    "cell-29",
    "cell-30",
    "cell-31",
    "cell-32",
    "cell-33",
    "cell-34",
    "cell-35",
    "cell-36",
    "cell-37",
    "cell-38",
    "start-rojo",

    "cell-40",
    "cell-41",
    "cell-42",
    "cell-43",
    "cell-44",
    "cell-45",
    "cell-46",

    "cell-47",
    "cell-48",
    "cell-49",
    "cell-50",
    "cell-51",
    "cell-52",
    "cell-53",
    "cell-54",
    "cell-55",
    "cell-56",
    "cell-57",
    "cell-58",
    "cell-59",
    "cell-60",

    "cell-61",
    "cell-62",
    "cell-63",
    "cell-64",
    "cell-65",
    "cell-66",
    "cell-67",
    "cell-68",

    "cell-1",
    "cell-2",
    "cell-3",
    "cell-4",
    "start-amarillo",
    "cell-6",
    "cell-7",
    "cell-8",
    "cell-9",
    "cell-10",
    "cell-11",
    "cell-12",
    "cell-13",
    "cell-14",
    "cell-15",
    "cell-16",
    "cell-17",

    "path-azul-1",
    "path-azul-2",
    "path-azul-3",
    "path-azul",
    "path-azul-5",
    "path-azul-6",
    "path-azul-7",
    "center"
];

// Recorrido completo del tablero en orden (simplificado, añadir según tu diseño)
const recorridoTableroRojo = [

    "start-rojo",

    "cell-40",
    "cell-41",
    "cell-42",
    "cell-43",
    "cell-44",
    "cell-45",
    "cell-46",

    "cell-47",
    "cell-48",
    "cell-49",
    "cell-50",
    "cell-51",
    "cell-52",
    "cell-53",
    "cell-54",
    "cell-55",
    "cell-56",
    "cell-57",
    "cell-58",
    "cell-59",
    "cell-60",

    "cell-61",
    "cell-62",
    "cell-63",
    "cell-64",
    "cell-65",
    "cell-66",
    "cell-67",
    "cell-68",

    "cell-1",
    "cell-2",
    "cell-3",
    "cell-4",
    "start-amarillo",
    "cell-6",
    "cell-7",
    "cell-8",
    "cell-9",
    "cell-10",
    "cell-11",
    "cell-12",
    "cell-13",
    "cell-14",
    "cell-15",
    "cell-16",
    "cell-17",

    "cell-18",
    "cell-19",
    "cell-20",
    "cell-21",
    "start-azul",
    "cell-23",
    "cell-24",
    "cell-25",
    "cell-26",
    "cell-27",
    "cell-28",
    "cell-29",
    "cell-30",
    "cell-31",
    "cell-32",
    "cell-33",
    "cell-34",

    "path-rojo-1",
    "path-rojo-2",
    "path-rojo-3",
    "path-rojo-4",
    "path-rojo-5",
    "path-rojo-6",
    "path-rojo-7",
    "center"
];

// Recorrido completo del tablero en orden (simplificado, añadir según tu diseño)
const recorridoTableroVerde = [
    "start-verde",
    "cell-57",
    "cell-58",
    "cell-59",
    "cell-60",

    "cell-61",
    "cell-62",
    "cell-63",
    "cell-64",
    "cell-65",
    "cell-66",
    "cell-67",
    "cell-68",
    "cell-1",
    "cell-2",
    "cell-3",
    "cell-4",
    // Amarillo empieza aquí
    "start-amarillo",
    "cell-6",
    "cell-7",
    "cell-8",
    "cell-9",
    "cell-10",
    "cell-11",
    "cell-12",
    "cell-13",
    "cell-14",
    "cell-15",
    "cell-16",
    "cell-17",
    "cell-18",
    "cell-19",
    "cell-20",
    "cell-21",
    "start-azul",
    "cell-23",
    "cell-24",
    "cell-25",
    "cell-26",
    "cell-27",
    "cell-28",
    "cell-29",
    "cell-30",
    "cell-31",
    "cell-32",
    "cell-33",
    "cell-34",
    "cell-35",
    "cell-36",
    "cell-37",
    "cell-38",
    "start-rojo",

    "cell-40",
    "cell-41",
    "cell-42",
    "cell-43",
    "cell-44",
    "cell-45",
    "cell-46",

    "cell-47",
    "cell-48",
    "cell-49",
    "cell-50",
    "cell-51",

    "path-verde-1",
    "path-verde-2",
    "path-verde-3",
    "path-verde-4",
    "path-verde-5",
    "path-verde-6",
    "path-verde-7",
    "center"
];


const TableroParchis = forwardRef(( { onMoverFicha }, ref) => {
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
        const valor = 5;//Math.floor(Math.random() * 6) + 1;
        setDado(valor);
        setFichaSeleccionada(null);
    }

    function seleccionarFicha(idFicha) {
        
        console.log('seleccionarFicha - idFicha: ' + idFicha + ' , '+ turnoActual);
        
        setFichaSeleccionada(idFicha);        
        /*
          Para poder probar hasta que funcione bien lo de los turnos no se mira de quien es
          
        if (idFicha.startsWith("ficha4") && turnoActual === 4) {
            setFichaSeleccionada(idFicha);
        } else if (idFicha.startsWith("ficha3") && turnoActual === 3) {
            setFichaSeleccionada(idFicha);
        } else if (idFicha.startsWith("ficha2") && turnoActual === 2) {
            setFichaSeleccionada(idFicha);
        } else if (idFicha.startsWith("ficha1") && turnoActual === 1) {
            setFichaSeleccionada(idFicha);
        } else {
            alert('No es el turno de este jugador');
        }
        
        */
    }

    function moverFicha() {
        if (!fichaSeleccionada) {
            alert("Selecciona una ficha para mover");
            return;
        }
        if (!dado) {
            alert("Tira el dado antes de mover");
            return;
        }

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

        if (indiceActual === -1 && dado != 5) {
            alert("La ficha está en casa. Debes sacar ficha con un 5 para poder mover (no implementado aquí).");
            return;
        }

        if (indiceActual === -1 && dado == 5) {

            const indiceNuevo = 0;
            const nuevaPos = recorridoTablero[0];

            setPosiciones({
                ...posiciones,
                [fichaSeleccionada]: nuevaPos,
            });

            onMoverFicha(fichaSeleccionada, indiceActual, indiceNuevo);


            setDado(null);
            setFichaSeleccionada(null);


            return;
        }

        let indiceNuevo = indiceActual + dado;

        if (indiceNuevo >= recorridoTablero.length) {
            indiceNuevo = recorridoTablero.length - 1;
        }

        console.log('Movimiento: indiceActual=' + indiceActual + ', dado=' + dado + ' --> indiceNuevo=' + indiceNuevo);

        const nuevaPos = recorridoTablero[indiceNuevo];
        console.log('fichaSeleccionada: ' + fichaSeleccionada + ', nuevaPos:' + nuevaPos);

        setPosiciones({
            ...posiciones,
            [fichaSeleccionada]: nuevaPos,
        });

        onMoverFicha(fichaSeleccionada, indiceActual, indiceNuevo);

        setDado(null);
        setFichaSeleccionada(null);
    }

    function renderFichasEnCelda(idCelda) {

        const fichasEnCelda = Object.entries(posiciones)
                .filter(([_, celda]) => celda === idCelda)
                .map(([fichaId]) => {
                    //console.log('fichaId: ' + fichaId + " - idCelda: " + idCelda)
                    const color = fichaId.startsWith("ficha1")
                            ? "amarillo"
                            : fichaId.startsWith("ficha2")
                            ? "verde"
                            : fichaId.startsWith("ficha3")
                            ? "rojo"
                            : "azul";

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
            <div style={{marginBottom: "1em"}}>
                <input
                    type="number"
                    min="1"
                    max="6"
                    style={{width: '100px'}}
                    value={dado}
                    onChange={(e) => {
                            const valor = parseInt(e.target.value, 10);
                            if (valor >= 1 && valor <= 6) {
                                setDado(valor);
                            }
                        }}
                    />                

                <button onClick={moverFicha}>Mover ficha</button>
                {dado !== null && <span style={{marginLeft: "1em"}}>Dado: {dado}</span>}
            </div>
            
            <table border="1">
                <tbody>
                    <tr>
                        <td
                            className="amarillo"
                            colSpan={7}
                            rowSpan={7}
                            id="home-amarillo"
                            style={{verticalAlign: "top", padding: "5px"}}
                            >
                            {renderFichasEnCelda("home-amarillo")}
                        </td>
                        <td colSpan={2} id="cell-1">1 {renderFichasEnCelda("cell-1")}</td>
                        <td colSpan={2} id="cell-68">68 {renderFichasEnCelda("cell-68")}</td>
                        <td colSpan={2} id="cell-67">67 {renderFichasEnCelda("cell-67")}</td>
                        <td
                            className="verde"
                            colSpan={7}
                            rowSpan={7}
                            id="home-verde"
                            style={{verticalAlign: "top", padding: "5px"}}
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
                        <td colSpan={2} id="cell-63">63 {renderFichasEnCelda("cell-63")}</td>
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
                        <td rowSpan={2} id="cell-12">12 {renderFichasEnCelda("cell-12")}</td>
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
                        <td rowSpan={2} id="cell-17">17 {renderFichasEnCelda("cell-17")}</td>
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
                        <td rowSpan={2} id="cell-51">51 {renderFichasEnCelda("cell-51")}</td>
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
                        <td rowSpan={2} id="cell-46">46 {renderFichasEnCelda("cell-46")}</td>
                        <td rowSpan={2} id="cell-47">47 {renderFichasEnCelda("cell-47")}</td>
                        <td rowSpan={2} id="cell-48">48 {renderFichasEnCelda("cell-48")}</td>
                        <td rowSpan={2} id="cell-49">49 {renderFichasEnCelda("cell-49")}</td>
                        <td rowSpan={2} id="cell-50">50 {renderFichasEnCelda("cell-50")}</td>
                    </tr>
            
                    <tr>
                        <td id="vacio"></td>
                        <td id="cell-26">26 {renderFichasEnCelda("cell-26")}</td>
                        <td className="rojo" id="path-rojo-7">- {renderFichasEnCelda("path-rojo-7")}</td>
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
                            style={{verticalAlign: "top", padding: "5px"}}
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
                            style={{verticalAlign: "top", padding: "5px"}}
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
                        <td colSpan={2} id="cell-29">29 {renderFichasEnCelda("cell-29")}</td>
                        <td className="rojo" colSpan={2} id="path-rojo-4">- {renderFichasEnCelda("path-rojo-4")}</td>
                        <td className="rojo" colSpan={2} id="start-rojo">39 {renderFichasEnCelda("cell-39")}</td>
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
                        <td colSpan={2} id="cell-34">34 {renderFichasEnCelda("cell-34")}</td>
                        <td colSpan={2} id="cell-35">35 {renderFichasEnCelda("cell-35")}</td>
                    </tr>
                </tbody>
            </table>
            </>
            );
});

export default TableroParchis;
