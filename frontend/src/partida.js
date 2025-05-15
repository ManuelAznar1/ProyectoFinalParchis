import React from 'react';
import './Partida.css';

function Partida() {
  return (
    <div>
      <h1>Tablero de Parchís</h1>
      <table border="1">
        <tbody>
          {/* Fila 1 */}
          <tr>
            <td className="amarillo" colSpan="7" rowSpan="7"></td>
            <td colSpan="2">1</td>
            <td colSpan="2">68</td>
            <td colSpan="2">67</td>
            <td className="verde" colSpan="7" rowSpan="7"></td>
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
            <td rowSpan="2">12</td>
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
              <img
                src="http://ilusionesopticas.org.es/wp-content/uploads/2015/10/movimiento-de-centro-hacia-afuera-400x400.jpg"
                alt="Centro del tablero"
              />
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
            <td className="azul" colSpan="7" rowSpan="7"></td>
            <td colSpan="2">27</td>
            <td className="rojo" colSpan="2">-</td>
            <td colSpan="2">41</td>
            <td className="rojo" colSpan="7" rowSpan="7"></td>
          </tr>
          {/* Fila 15 a 20 */}
          <tr>
            <td colSpan="2">28</td>
            <td className="rojo" colSpan="2">-</td>
            <td colSpan="2">40</td>
          </tr>
          <tr>
            <td colSpan="2">29</td>
            <td className="rojo" colSpan="2">-</td>
            <td className="rojo" colSpan="2">39</td>
          </tr>
          <tr>
            <td colSpan="2">30</td>
            <td className="rojo" colSpan="2">-</td>
            <td colSpan="2">38</td>
          </tr>
          <tr>
            <td colSpan="2">31</td>
            <td className="rojo" colSpan="2">-</td>
            <td colSpan="2">37</td>
          </tr>
          <tr>
            <td colSpan="2">32</td>
            <td className="rojo" colSpan="2">-</td>
            <td colSpan="2">36</td>
          </tr>
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
