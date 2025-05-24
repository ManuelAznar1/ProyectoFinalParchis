CREATE DATABASE IF NOT EXISTS parchis;
USE parchis;


CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de partidas
CREATE TABLE IF NOT EXISTS partidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(255) NOT NULL,
    status ENUM('creada', 'empezada', 'acabada'),
    current_turn INT,    
    creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dice INT,       
    posiciones TEXT,
    jugadores INT DEFAULT 2,
  UNIQUE KEY `codigo_UNIQUE` (`codigo`)    
);

-- Tabla de jugadores
CREATE TABLE IF NOT EXISTS jugadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL,
    posicion INT DEFAULT 0,
    color INT NOT NULL, 
    partida_id INT ,
    FOREIGN KEY (partida_id) REFERENCES partidas(id) ON DELETE CASCADE
);

-- Tabla de movimientos
CREATE TABLE IF NOT EXISTS movimientos (
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
);

CREATE TABLE mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(100),
  message TEXT,
  timestamp DATETIME,
  partida_id INT,
  FOREIGN KEY (partida_id) REFERENCES partidas(id) ON DELETE CASCADE
);

INSERT INTO `` (`id`,`nombre`,`email`,`contrasena`,`fecha_registro`) VALUES (1,'m','m@gmail.com','$2b$10$mOY4mRJN6iEpJHWkyZ8tdefT57DxSHWPJzfnSUC0H0LQ0Lw6axL6.','2025-05-20 15:46:29');
INSERT INTO `` (`id`,`nombre`,`email`,`contrasena`,`fecha_registro`) VALUES (2,'s','s@gmail.com','$2b$10$XkxKKzLWIXhbevcoFqhDrOGo0zKFI2VAZImgkc/gtIV3jkeITi9f2','2025-05-20 15:47:05');
