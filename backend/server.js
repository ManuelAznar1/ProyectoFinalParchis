const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const LogicaPartida = require('./logicaPartida'); // Asegúrate de que esté en el mismo directorio que server.js

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'parchis'
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

      // Obtener la fecha de registro recién insertada con alias
      db.query('SELECT fecha_registro AS fechaRegistro FROM usuarios WHERE id = ?', [result.insertId], (err2, result2) => {
        if (err2) {
          console.error('Error al obtener fecha_registro:', err2);
          return res.status(500).json({ error: 'Error al obtener la fecha de registro' });
        }

        console.log('Resultado consulta fecha_registro:', result2); // LOG para depurar

        const fechaRegistro = result2 && result2[0] ? result2[0].fechaRegistro : null;
        console.log('Fecha de registro seleccionada:', fechaRegistro);  // LOG para depurar

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

    console.log('Resultado consulta usuario:', result); // LOG para depurar

    if (result.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    bcrypt.compare(contrasena, result[0].contrasena, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Error al verificar la contraseña' });

      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      console.log('Fecha de registro en login:', result[0].fechaRegistro);  // LOG para depurar

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
// LÓGICA DEL JUEGO PARCHÍS
// =======================

const juego = new LogicaPartida(); // Instancia única de la partida

// Obtener estado actual del juego
app.get('/estado', (req, res) => {
  const estado = juego.obtenerEstado();
  res.json(estado);
});

// Tirar el dado
app.post('/tirar-dado', (req, res) => {
  const resultado = juego.tirarDado();
  const estado = juego.obtenerEstado();
  res.json({ resultado, estado });
});

// Mover ficha
app.post('/mover-ficha', (req, res) => {
  const { color, index } = req.body;

  if (!color || index === undefined) {
    return res.status(400).json({ error: 'Color e índice son requeridos' });
  }

  const mensaje = juego.moverFicha(color, index);
  const estado = juego.obtenerEstado();
  res.json({ mensaje, estado });
});

// =======================
// INICIAR SERVIDOR
// =======================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
