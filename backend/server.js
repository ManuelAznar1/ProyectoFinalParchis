const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const db = require('./db');

/*
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
*/

const app = express();

app.use(express.json());
app.use(cors());


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });



// =======================
// INICIAR SERVIDOR
// =======================


io.on('connection', (socket) => {
  console.log('Usuario conectado');

  sendRoomList(socket);

  socket.on('join', async ({ codigo }) => {
    await db.execute(
      'INSERT IGNORE INTO partidas (codigo, status, current_turn, creada_en) VALUES (?, ? ,?, NOW())',
      [codigo, 'creada', 1 ]
    );

    const [partidaRows] = await db.execute('SELECT id, codigo FROM partidas WHERE codigo = ?', [codigo]);
    const partida = partidaRows[0];

    socket.join(codigo);

    const [msgs] = await db.execute(
      'SELECT user, message, timestamp FROM mensajes WHERE partida_id = ? ORDER BY timestamp ASC',
      [partida.id]
    );
    socket.emit('chat history', { messages: msgs, description: partida.codigo });

    sendRoomList(io);

    sendPartida(io, partida.codigo);        
  });

  socket.on('chat message', async ({ partida, user, message }) => {
    const timestamp = new Date();
    const [partidaRow] = await db.execute('SELECT id FROM partidas WHERE codigo = ?', [partida]);
    const partida_id = partidaRow[0]?.id;
    if (!partida_id) return;

    await db.execute(
      'INSERT INTO mensajes (partida_id, user, message, timestamp) VALUES (?, ?, ?, ?)',
      [partida_id, user, message, timestamp]
    );
    io.to(partida).emit('chat message', { partida, user, message, timestamp });
  });
  
  socket.on('send turn', async ({ partida, user, turnoActual, dado }) => {
    const timestamp = new Date();
    const [partidaRow] = await db.execute('SELECT id FROM partidas WHERE codigo = ?', [partida]);
    const partida_id = partidaRow[0]?.id;
    if (!partida_id) return;
    
    console.log('turnoActual: '+turnoActual);
    console.log('partida: '+partida);
    console.log('partida_id: '+partida_id);    

    await db.execute(
      'UPDATE partidas SET current_turn = ?, dice = ? WHERE id = ?',
      [turnoActual, dado, partida_id]
    );
    io.to(partida).emit('send turn', { partida, user, turnoActual, dado, timestamp });
  });  
  
  socket.on('send mover ficha', async ({ partida, user, ficha, dado, anteriorPosicion, nuevaPosicion }) => {
      
    const timestamp = new Date();
/*      
    const [partidaRow] = await db.execute('SELECT id FROM partidas WHERE codigo = ?', [partida]);
    const partida_id = partidaRow[0]?.id;
    if (!partida_id) return;
    
    const [jugadorRow] = await db.execute('SELECT id FROM jugadores WHERE nickname = ? AND codigo = ?', [user, partida]);
    const jugador_id = jugadorRow[0]?.id;
    if (!jugador_id) return;    
    
    console.log('partida: '+partida);
    console.log('partida_id: '+partida_id);    
    console.log('user: '+user);
    console.log('jugador_id: '+jugador_id);    
*/
    console.log('anteriorPosicion: '+anteriorPosicion);
    console.log('nuevaPosicion: '+nuevaPosicion);
   
/*
    id INT AUTO_INCREMENT PRIMARY KEY,
    jugador_id INT,
    partida_id INT,
    ficha INT,  -- número de ficha (1 a 4)
    dado INT,
    posicion_anterior INT,
    posicion_nueva INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jugador_id) REFERENCES jugadores(id) ON DELETE CASCADE,
    FOREIGN KEY (partida_id) REFERENCES partidas(id) ON DELETE CASCADE
 */    
/*
    await db.execute(
      'INSERT INTO movimientos (jugador_id, partida_id, ficha, dado, posicion_anterior, posicion_nueva) VALUES (?, ?, ?, ?, ?, ?)',
      [jugador_id, partida_id, ficha, dado, anteriorPosicion, nuevaPosicion]
    );
    */
    io.to(partida).emit('send mover ficha', { partida, user, ficha, dado, anteriorPosicion, nuevaPosicion, timestamp });
  });    
  
});

async function sendRoomList(target) {
  const [partidas] = await db.execute('SELECT id, codigo FROM partidas ORDER BY id ASC');
  target.emit('partida list', partidas);
}


async function sendPartida(target, partida) {
  const [partidaRow] = await db.execute('SELECT id, codigo, status, current_turn, creada_en, dice FROM partidas WHERE codigo = ?', [partida]);
  target.emit('send partida', partidaRow[0]);
}


// =======================
// CONEXIÓN A BASE DE DATOS
// =======================
/*
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'parchis'
});
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});
*/



// =======================
// RUTAS DE AUTENTICACIÓN
// =======================

app.post('/crear-usuario', async (req, res) => {
  const { nombre, email, contrasena } = req.body;

  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const [result] = await db.execute(
      'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)',
      [nombre, email, hashedPassword]
    );

    const [rows] = await db.execute(
      'SELECT fecha_registro AS fechaRegistro FROM usuarios WHERE id = ?',
      [result.insertId]
    );

    const fechaRegistro = rows.length ? rows[0].fechaRegistro : null;
    const token = jwt.sign({ id: result.insertId, nombre }, 'secreta', { expiresIn: '1h' });

    res.status(201).json({ mensaje: 'Usuario creado con éxito', token, nombre, fechaRegistro });
  } catch (err) {
    console.error('Error en crear-usuario:', err);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

app.post('/iniciar-sesion', async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT id, nombre, email, contrasena, fecha_registro AS fechaRegistro FROM usuarios WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = rows[0];
    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre }, 'secreta', { expiresIn: '1h' });

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      nombre: usuario.nombre,
      fechaRegistro: usuario.fechaRegistro ? new Date(usuario.fechaRegistro).toISOString() : null
    });
  } catch (err) {
    console.error('Error en iniciar-sesion:', err);
    res.status(500).json({ error: 'Error al buscar el usuario' });
  }
});

// =======================
// ENDPOINT DEL DADO 🎲
// =======================

app.get('/roll', (req, res) => {
  const number = Math.floor(Math.random() * 6) + 1; // 1-6
  res.json({ number });
});


server.listen(3001, () => {
  console.log('Servidor escuchando en puerto 3001');
});

