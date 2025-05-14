const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Para encriptar las contraseñas
const jwt = require('jsonwebtoken'); // Para crear tokens de sesión (JWT)
const app = express();
const PORT = 3001;

// Middleware para manejar el cuerpo de las solicitudes (como JSON)
app.use(express.json());
app.use(cors());

// Crear conexión con la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',      // O la IP donde esté tu base de datos
  user: 'root',           // Tu usuario de MySQL (por defecto es 'root')
  password: '',           // La contraseña de tu base de datos (déjala vacía si no tiene)
  database: 'parchis'     // Nombre de tu base de datos
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para crear un nuevo usuario (registro)
app.post('/crear-usuario', (req, res) => {
  const { nombre, email, contrasena } = req.body;

  // Verificar si todos los campos están presentes
  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  // Encriptar la contraseña
  bcrypt.hash(contrasena, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error al encriptar la contraseña' });
    }

    // Insertar el usuario en la base de datos
    const query = 'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)';
    db.query(query, [nombre, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error al insertar el usuario:', err);
        return res.status(500).json({ error: 'Error al crear el usuario' });
      }
      // Generar un token y devolver también el nombre
      const token = jwt.sign({ id: result.insertId, nombre }, 'secreta', { expiresIn: '1h' });
      res.status(201).json({ mensaje: 'Usuario creado con éxito', token, nombre });
    });
  });
});

// Ruta para iniciar sesión (login)
app.post('/iniciar-sesion', (req, res) => {
  const { email, contrasena } = req.body;

  // Verificar si los datos son válidos
  if (!email || !contrasena) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  // Buscar el usuario en la base de datos
  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error al buscar el usuario:', err);
      return res.status(500).json({ error: 'Error al buscar el usuario' });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Comparar la contraseña ingresada con la almacenada (hash)
    bcrypt.compare(contrasena, result[0].contrasena, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error al verificar la contraseña' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      // Generar un token JWT para el usuario
      const token = jwt.sign({ id: result[0].id, nombre: result[0].nombre }, 'secreta', { expiresIn: '1h' });
      
      // Enviar el token Y el nombre en la respuesta
      res.json({ mensaje: 'Inicio de sesión exitoso', token, nombre: result[0].nombre });
    });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
