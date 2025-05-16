const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// =======================
// CONEXIÓN A BASE DE DATOS
// =======================
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

// =======================
// INICIAR SERVIDOR
// =======================

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

