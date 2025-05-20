const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

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

  //sendRoomList(socket);

  socket.on('join', async ({ codigo }) => {
    await db.execute(
      'INSERT IGNORE INTO partidas (codigo, status, current_turn, creada_en) VALUES (?, ? ,?, NOW())',
      [codigo, 'creada', 1 ]
    );

    const [partidaRows] = await db.execute('SELECT id, codigo FROM partidas WHERE codigo = ?', [name]);
    const partida = partidaRows[0];

    socket.join(name);

    const [msgs] = await db.execute(
      'SELECT user, message, timestamp FROM mensajes WHERE partida_id = ? ORDER BY timestamp ASC',
      [partida.id]
    );
    socket.emit('chat history', { messages: msgs, description: partida.codigo });

    sendRoomList(io);
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
});

async function sendRoomList(target) {
  const [partidas] = await db.execute('SELECT id, codigo FROM partidas ORDER BY id ASC');
  target.emit('partida list', partidas);
}





// =======================
// CONEXIÓN A BASE DE DATOS
// =======================
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

// =======================
// RUTAS DE AUTENTICACIÓN
// =======================

app.post('/crear-usuario', (req, res) => {
  const { nombre, email, contrasena } = req.body;

  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  bcrypt.hash(contrasena, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Error al encriptar la contraseña' });

    const query = 'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)';
    db.query(query, [nombre, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error al insertar el usuario:', err);
        return res.status(500).json({ error: 'Error al crear el usuario' });
      }

      db.query('SELECT fecha_registro AS fechaRegistro FROM usuarios WHERE id = ?', [result.insertId], (err2, result2) => {
        if (err2) {
          console.error('Error al obtener fecha_registro:', err2);
          return res.status(500).json({ error: 'Error al obtener la fecha de registro' });
        }

        const fechaRegistro = result2 && result2[0] ? result2[0].fechaRegistro : null;
        const token = jwt.sign({ id: result.insertId, nombre }, 'secreta', { expiresIn: '1h' });

        res.status(201).json({ mensaje: 'Usuario creado con éxito', token, nombre, fechaRegistro });
      });
    });
  });
});

app.post('/iniciar-sesion', (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  const query = 'SELECT id, nombre, email, contrasena, fecha_registro AS fechaRegistro FROM usuarios WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error al buscar el usuario:', err);
      return res.status(500).json({ error: 'Error al buscar el usuario' });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    bcrypt.compare(contrasena, result[0].contrasena, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Error al verificar la contraseña' });

      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ id: result[0].id, nombre: result[0].nombre }, 'secreta', { expiresIn: '1h' });

      res.json({
        mensaje: 'Inicio de sesión exitoso',
        token,
        nombre: result[0].nombre,
        fechaRegistro: result[0].fechaRegistro ? new Date(result[0].fechaRegistro).toISOString() : null
      });
    });
  });
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

