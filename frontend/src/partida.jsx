import React, { useEffect, useState } from 'react';
import './Partida.css';
import axios from 'axios';
import Chat from './Chat';

function Partida({ volverMenu, codigo, usuario, modo, jugadores = 2, socket }) {
  const [dice, setDice] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [turnoActual, setTurnoActual] = useState(1);
  
  useEffect(() => {

    socket.on('send turn', (msg) => {
        
      if (msg.partida === codigo && msg.user !== usuario?.nombre)   {
        console.log('turno remoto para mi:'+msg.turnoActual);
       
        setTurnoActual(msg.turnoActual); 
        setDice(msg.dado);
      }else{
          console.log('turno remoto: IGNORADO');
      }

    });
    
    socket.on('send partida', (msg) => {
    
        console.log('msg.codigo:'+msg.codigo + ' - codigo: ' +codigo);        
            
      if (msg.codigo === codigo)   {
        console.log('cargando mi partida:'+msg.codigo);
       
        setTurnoActual(msg.current_turn); 
        setDice(msg.dice);
        
        
      }else{
          console.log('partida remoto: IGNORADO');
      }

    });    

    return () => {
      socket.off('send turn');
      socket.off('send partida');      
    };
  }, []);  
  
  function sendTurno(turno, dado) {
      const usuarioNombre = usuario?.nombre;
      
      console.log('enviando turno: ' +turno);
      
      socket.emit('send turn', { partida: codigo, user: usuarioNombre, turnoActual: turno, dado });
  }  


  function sendMoverFicha(ficha, anteriorPosicion, nuevaPosicion) {
      const usuarioNombre = usuario?.nombre;
      
      console.log('enviando movimiento ficha: ' +ficha + ', anteriorPosicion: ' + anteriorPosicion + ', nuevaPosicion: ' + nuevaPosicion);
      
      socket.emit('send mover ficha', { partida: codigo, user: usuarioNombre, ficha,  anteriorPosicion, nuevaPosicion});
  }  
  
  const rollDice = async () => {
    setRolling(true);
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_HOST+'/roll');
      setTimeout(() => {
          
        const dado = res.data.number;
        setDice(dado);
        
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
        
        
      <Chat socket={socket} codigo={codigo} usuario={usuario?.nombre}/>
        
        
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
      <table border="1">
        <tbody>
          {/* Fila 1 */}
          <tr>
            <td id="casaAmarillo" className="amarillo" colSpan="7" rowSpan="7">
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td><span className="ficha amarillo">1</span></td>
                    <td><span className="ficha amarillo">2</span></td>
                  </tr>
                  <tr>
                    <td><span className="ficha amarillo">3</span></td>
                    <td><span className="ficha amarillo">4</span></td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td colSpan="2">1</td>
            <td colSpan="2">68</td>
            <td colSpan="2">67</td>
            <td id="casaVerde" className="verde" colSpan="7" rowSpan="7">
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td><span className="ficha verde">1</span></td>
                    <td><span className="ficha verde">2</span></td>
                  </tr>
                  <tr>
                    <td><span className="ficha verde">3</span></td>
                    <td><span className="ficha verde">4</span></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {/* Fila 2 */}
          <tr>
            <td colSpan="2">2</td>
            <td className="amarillo" colSpan="2">-</td>
            <td colSpan="2">66</td>
          </tr>
          {/* Fila 3 */}
          <tr>
            <td colSpan="2">3</td>
            <td className="amarillo" colSpan="2">-</td>
            <td colSpan="2">65</td>
          </tr>
          {/* Fila 4 */}
          <tr>
            <td colSpan="2">4</td>
            <td className="amarillo" colSpan="2">-</td>
            <td colSpan="2">64</td>
          </tr>
          {/* Fila 5 */}
          <tr>
            <td className="amarillo" colSpan="2">5</td>
            <td className="amarillo" colSpan="2">-</td>
            <td colSpan="2">63</td>
          </tr>
          {/* Fila 6 */}
          <tr>
            <td colSpan="2">6</td>
            <td className="amarillo" colSpan="2">-</td>
            <td colSpan="2">62</td>
          </tr>
          {/* Fila 7 */}
          <tr>
            <td colSpan="2">7</td>
            <td className="amarillo" colSpan="2">-</td>
            <td colSpan="2">61</td>
          </tr>
          {/* Fila 8 */}
          <tr>
            <td rowSpan="2">16</td>
            <td rowSpan="2">15</td>
            <td rowSpan="2">14</td>
            <td rowSpan="2">13</td>
            <td rowSpan="2"><span className="seguro">12</span></td>
            <td rowSpan="2">11</td>
            <td rowSpan="2">10</td>
            <td id="vacio"></td>
            <td>8</td>
            <td>-</td>
            <td>-</td>
            <td>60</td>
            <td id="vacio"></td>
            <td rowSpan="2">58</td>
            <td rowSpan="2">57</td>
            <td className="verde" rowSpan="2">56</td>
            <td rowSpan="2">55</td>
            <td rowSpan="2">54</td>
            <td rowSpan="2">53</td>
            <td rowSpan="2">52</td>
          </tr>
          {/* Fila 9 */}
          <tr>
            <td>9</td>
            <td colSpan="4" rowSpan="4">
                CENTRO
            </td>
            <td>59</td>
          </tr>
          {/* Fila 10 */}
          <tr>
            <td rowSpan="2">17</td>
            <td className="azul" rowSpan="2">|</td>
            <td className="azul" rowSpan="2">|</td>
            <td className="azul" rowSpan="2">|</td>
            <td className="azul" rowSpan="2">|</td>
            <td className="azul" rowSpan="2">|</td>
            <td className="azul" rowSpan="2">|</td>
            <td>|</td>
            <td>|</td>
            <td className="verde" rowSpan="2">|</td>
            <td className="verde" rowSpan="2">|</td>
            <td className="verde" rowSpan="2">|</td>
            <td className="verde" rowSpan="2">|</td>
            <td className="verde" rowSpan="2">|</td>
            <td className="verde" rowSpan="2">|</td>
            <td rowSpan="2">51</td>
          </tr>
          {/* Fila 11 */}
          <tr>
            <td>|</td>
            <td>|</td>
          </tr>
          {/* Fila 12 */}
          <tr>
            <td rowSpan="2">18</td>
            <td rowSpan="2">19</td>
            <td rowSpan="2">20</td>
            <td rowSpan="2">21</td>
            <td className="azul" rowSpan="2">22</td>
            <td rowSpan="2">23</td>
            <td rowSpan="2">24</td>
            <td>25</td>
            <td>43</td>
            <td rowSpan="2">44</td>
            <td rowSpan="2">45</td>
            <td rowSpan="2">46</td>
            <td rowSpan="2">47</td>
            <td rowSpan="2">48</td>
            <td rowSpan="2">49</td>
            <td rowSpan="2">50</td>
          </tr>
          {/* Fila 13 */}
          <tr>
            <td id="vacio"></td>
            <td>26</td>
            <td>-</td>
            <td>-</td>
            <td>42</td>
            <td id="vacio"></td>
          </tr>
          {/* Fila 14 */}
          <tr>
            <td id="casaAzul" className="azul" colSpan="7" rowSpan="7">
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td><span className="ficha azul">1</span></td>
                    <td><span className="ficha azul">2</span></td>
                  </tr>
                  <tr>
                    <td><span className="ficha azul">3</span></td>
                    <td><span className="ficha azul">4</span></td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td colSpan="2">27</td>
            <td className="rojo" colSpan="2">-</td>
            <td colSpan="2">41</td>
            <td id="casaRojo" className="rojo" colSpan="7" rowSpan="7">
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td><span className="ficha rojo">1</span></td>
                    <td><span className="ficha rojo">2</span></td>
                  </tr>
                  <tr>
                    <td><span className="ficha rojo">3</span></td>
                    <td><span className="ficha rojo">4</span></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {/* Fila 15 */}
          <tr>
            <td colSpan="2">28</td>
            <td className="rojo" colSpan="2">-</td>
            <td colSpan="2">40</td>
          </tr>
          {/* Fila 16 */}
          <tr>
            <td colSpan="2">29</td>
            <td className="rojo" colSpan="2">-</td>
            <td className="rojo" colSpan="2">39</td>
          </tr>
          {/* Fila 17 */}
          <tr>
            <td colSpan="2">30</td>
            <td className="rojo" colSpan="2">-</td>
            <td colSpan="2">38</td>
          </tr>
          {/* Fila 18 */}
          <tr>
            <td colSpan="2">31</td>
            <td className="rojo" colSpan="2">-</td>
            <td colSpan="2">37</td>
          </tr>
          {/* Fila 19 */}
          <tr>
            <td colSpan="2">32</td>
            <td className="rojo" colSpan="2">-</td>
            <td colSpan="2">36</td>
          </tr>
          {/* Fila 20 */}
          <tr>
            <td colSpan="2">33</td>
            <td colSpan="2">34</td>
            <td colSpan="2">35</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Partida;