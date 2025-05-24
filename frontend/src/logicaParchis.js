// Se inicializa así el juego

export const posicionesIniciales = {
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
    "seguro-cell-12",
    "cell-13",
    "cell-14",
    "cell-15",
    "cell-16",
    "seguro-cell-17",
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
    "seguro-cell-29",
    "cell-30",
    "cell-31",
    "cell-32",
    "cell-33",
    "seguro-cell-34",
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
    "seguro-cell-46",

    "cell-47",
    "cell-48",
    "cell-49",
    "cell-50",
    "seguro-cell-51",
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
    "seguro-cell-63",
    "cell-64",
    "cell-65",
    "cell-66",
    "cell-67",
    "seguro-cell-68",

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
    "seguro-cell-29",
    "cell-30",
    "cell-31",
    "cell-32",
    "cell-33",
    "seguro-cell-34",
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
    "seguro-cell-46",

    "cell-47",
    "cell-48",
    "cell-49",
    "cell-50",
    "seguro-cell-51",
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
    "seguro-cell-63",
    "cell-64",
    "cell-65",
    "cell-66",
    "cell-67",
    "seguro-cell-68",

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
    "seguro-cell-12",
    "cell-13",
    "cell-14",
    "cell-15",
    "cell-16",
    "seguro-cell-17",

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
    "seguro-cell-46",

    "cell-47",
    "cell-48",
    "cell-49",
    "cell-50",
    "seguro-cell-51",
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
    "seguro-cell-63",
    "cell-64",
    "cell-65",
    "cell-66",
    "cell-67",
    "seguro-cell-68",

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
    "seguro-cell-12",
    "cell-13",
    "cell-14",
    "cell-15",
    "cell-16",
    "seguro-cell-17",

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
    "seguro-cell-29",
    "cell-30",
    "cell-31",
    "cell-32",
    "cell-33",
    "seguro-cell-34",

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
    "seguro-cell-63",
    "cell-64",
    "cell-65",
    "cell-66",
    "cell-67",
    "seguro-cell-68",
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
    "seguro-cell-12",
    "cell-13",
    "cell-14",
    "cell-15",
    "cell-16",
    "seguro-cell-17",
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
    "seguro-cell-29",
    "cell-30",
    "cell-31",
    "cell-32",
    "cell-33",
    "seguro-cell-34",
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
    "seguro-cell-46",

    "cell-47",
    "cell-48",
    "cell-49",
    "cell-50",
    "seguro-cell-51",

    "path-verde-1",
    "path-verde-2",
    "path-verde-3",
    "path-verde-4",
    "path-verde-5",
    "path-verde-6",
    "path-verde-7",
    "center"
];



function dameRecorridoFicha(ficha) {
    let recorridoTablero = recorridoTableroAmarillo;

    if (ficha.startsWith("ficha4")) {
        recorridoTablero = recorridoTableroAzul;
    } else if (ficha.startsWith("ficha3")) {
        recorridoTablero = recorridoTableroRojo;
    } else if (ficha.startsWith("ficha2")) {
        recorridoTablero = recorridoTableroVerde;
    }

    return recorridoTablero;
}

export function esMiTurno(ficha, turno) {
    return ficha[5] == turno;
}

function esFichaEnemiga(ficha1, ficha2) {
    return ficha1[5] !== ficha2[5]; // jugador diferente
}



function esCeldaSegura(posicion) {
    return posicion.startsWith("seguro-") || posicion.startsWith("start-");
}

function avanzarFicha(recorridoTablero, posiciones, ficha, nuevaPosicion) {
    const colisiones = verificarColision(posiciones, ficha, nuevaPosicion);

    // Verificar si hay ya 2 fichas del mismo color en la nueva posición
    const mismoColor = colisiones.filter(f => !esFichaEnemiga(ficha, f));

    if (mismoColor.length >= 2 || colisiones.length > 1) {
        const posicionAnterior = retrocederCasillas(recorridoTablero, nuevaPosicion);
        console.log(`⚠️ ${ficha} no puede entrar a ${nuevaPosicion} (2 fichas del mismo color). Retrocede a ${posicionAnterior}.`);
        moverFicha(posiciones, ficha, posicionAnterior);
        return;
    }

    if (!puedoAvanzar(ficha, nuevaPosicion)) {
        const posicionAnterior = retrocederCasillas(recorridoTablero, nuevaPosicion);
        console.log(`⚠️ ${ficha} no puede avanzar a ${nuevaPosicion} hay un PUENTE. Retrocede a ${posicionAnterior}.`);
        moverFicha(posiciones, ficha, posicionAnterior);
        return;
    }

    // Si hay exactamente 1 ficha enemiga, se puede comer
    const enemiga = colisiones.find(f => esFichaEnemiga(ficha, f));

    if (enemiga && !esCeldaSegura(nuevaPosicion)) {

        moverFicha(posiciones, enemiga, `home-${obtenerColor(enemiga)}`);

        console.log(`¡${ficha} se comió a ${enemiga}!`);

        const jugador = ficha[5];

        const nuevaPosExtra = avanzarCasillas(recorridoTablero, nuevaPosicion, 20);
        console.log(`Jugador ${jugador} (${obtenerColor(ficha)}) gana 20 casillas y se mueve a ${nuevaPosExtra}.`);

        nuevaPosicion = nuevaPosExtra;
    }

    moverFicha(posiciones, ficha, nuevaPosicion);
}



function obtenerColor(ficha) {
    const jugador = ficha[5];
    return {
        "1": "amarillo",
        "2": "verde",
        "3": "rojo",
        "4": "azul"
    }[jugador];
}


function mostrarEstadoTablero(posiciones) {
    const estado = {};

    for (const [ficha, posicion] of Object.entries(posiciones)) {
        if (!estado[posicion])
            estado[posicion] = [];
        estado[posicion].push(ficha);
    }

    console.table(estado);
}


function obtenerFichasEnPosicion(posiciones, posicion) {
    return Object.entries(posiciones)
            .filter(([, pos]) => pos === posicion)
            .map(([ficha]) => ficha);
}

function verificarColision(posiciones, ficha, nuevaPosicion) {
    const otrasFichas = obtenerFichasEnPosicion(posiciones, nuevaPosicion).filter(f => f !== ficha);

    if (otrasFichas.length > 0) {
        return otrasFichas;
    }
    return [];
}


function moverFicha(posiciones, ficha, nuevaPosicion) {
    if (!posiciones[ficha]) {
        console.warn(`Ficha ${ficha} no existe.`);
        return;
    }

    posiciones[ficha] = nuevaPosicion;
}

function hayDosFichasMismoJugador(posiciones, posicionObjetivo) {
    const fichas = Object.entries(posiciones)
            .filter(([, pos]) => pos === posicionObjetivo)
            .map(([ficha]) => ficha);

    if (fichas.length !== 2)
        return false;

    const jugador1 = fichas[0][5]; // 6º carácter indica el jugador: ficha11, ficha21, etc.
    const jugador2 = fichas[1][5];

    return jugador1 === jugador2;
}


function puedoAvanzar(posiciones, ficha, nuevaPosicion) {

    const recorridoFicha = dameRecorridoFicha(ficha);


    const posicionActual = posiciones[ficha];

    const posicionActualIndex = recorridoFicha.indexOf(posicionActual);
    const nuevaPosicionIndex = recorridoFicha.indexOf(nuevaPosicion);
    const distancia = nuevaPosicionIndex - posicionActualIndex;

    for (var i = 1; i <= distancia; i++) {
        const posicionIntermedia = recorridoFicha[posicionActualIndex + i];

        if (hayDosFichasMismoJugador(posiciones, posicionIntermedia)) {
            return false;
        }
    }


    return true;
}

function estaFichaEnCasa(posiciones, ficha) {

    if (posiciones[ficha].startsWith("home-")) {
        return true;
    }
    return false;
}

export function moverFichaTablero(posiciones, fichaSeleccionada, dado) {

    const recorridoTablero = dameRecorridoFicha(fichaSeleccionada);

    const posActual = posiciones[fichaSeleccionada];
    const indiceActual = recorridoTablero.indexOf(posActual);


    if (estaFichaEnCasa(posiciones, fichaSeleccionada) && dado != 5) {
        console.log("La ficha está en casa. Debes sacar ficha con un 5 para poder mover (no implementado aquí).");

    } else if (estaFichaEnCasa(posiciones, fichaSeleccionada) && dado == 5) {

        const indiceNuevo = 0;
        const nuevaPos = recorridoTablero[indiceNuevo];

        if (hayDosFichasMismoJugador(posiciones, nuevaPos)) {
            console.log(`⚠️ ${fichaSeleccionada} no puede salir de casa (2 fichas del mismo color).`);

        } else {

            const colisiones = verificarColision(posiciones, fichaSeleccionada, nuevaPos);

            // Verificar si hay ya 2 fichas del mismo color en la nueva posición
            const mismoColor = colisiones.filter(f => !esFichaEnemiga(fichaSeleccionada, f));

            if (mismoColor.length >= 2 || colisiones.length > 1) {
                const posicionAnterior = retrocederCasillas(recorridoTablero, nuevaPos);
                console.log(`⚠️ ${fichaSeleccionada} no puede entrar a ${nuevaPos} (2 fichas del mismo color). Retrocede a ${posicionAnterior}.`);
                moverFicha(posiciones, fichaSeleccionada, posicionAnterior);
                return;
            }

            posiciones[fichaSeleccionada] = nuevaPos;
        }

    } else {

        let indiceNuevo = indiceActual + dado;

        if (indiceNuevo >= recorridoTablero.length) {
            indiceNuevo = recorridoTablero.length - 1;
        }
        const nuevaPos = recorridoTablero[indiceNuevo];


        console.log('Movimiento: indiceActual=' + indiceActual + ', dado=' + dado + ' --> indiceNuevo=' + indiceNuevo);

        console.log('fichaSeleccionada: ' + fichaSeleccionada + ', nuevaPos:' + nuevaPos);

        avanzarFicha(recorridoTablero, posiciones, fichaSeleccionada, nuevaPos);

    }

    return posiciones;

}


function avanzarCasillas(recorridoTablero, posicionActual, cantidad) {

    const indiceActual = recorridoTablero.indexOf(posicionActual);
    let indiceNuevo = indiceActual + cantidad;

    if (indiceNuevo >= recorridoTablero.length) {
        indiceNuevo = recorridoTablero.length - 1;
    }
    const nuevaPos = recorridoTablero[indiceNuevo];
    return nuevaPos;
}

function retrocederCasillas(recorridoTablero, posicionActual, cantidad = 1) {

    const indiceActual = recorridoTablero.indexOf(posicionActual);
    let indiceNuevo = indiceActual - cantidad;

    const nuevaPos = recorridoTablero[indiceNuevo];
    return nuevaPos;
}