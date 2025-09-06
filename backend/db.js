// backend/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./chat.db', (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');

    // Criação das tabelas se elas não existirem
    db.run(`
      CREATE TABLE IF NOT EXISTS Usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Salas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(255) NOT NULL,
        criador_id INTEGER,
        FOREIGN KEY (criador_id) REFERENCES Usuarios(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Mensagens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texto TEXT,
        usuario_id INTEGER,
        sala_id INTEGER,
        data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
        tipo TEXT DEFAULT 'texto',
        url_anexo TEXT,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
        FOREIGN KEY (sala_id) REFERENCES Salas(id)
      )
    `);
  }
});

module.exports = db;