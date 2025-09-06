const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const bcrypt = require('bcryptjs');
const cors = require('cors');
const db = require('./db');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Configuração do Multer para salvar imagens na pasta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

// Rota de registro de usuário
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    db.run('INSERT INTO Usuarios (username, senha) VALUES (?, ?)', [username, hashedPassword], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ message: 'Nome de usuário já existe.' });
        }
        console.error(err);
        return res.status(500).json({ message: 'Erro ao registrar o usuário.' });
      }
      res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: this.lastID });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Rota de login de usuário
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
  }
  try {
    db.get('SELECT * FROM Usuarios WHERE username = ?', [username], async (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
      }
      if (!user) {
        return res.status(401).json({ message: 'Nome de usuário ou senha incorretos.' });
      }
      const passwordMatch = await bcrypt.compare(password, user.senha);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Nome de usuário ou senha incorretos.' });
      }
      res.status(200).json({ message: 'Login bem-sucedido!', userId: user.id, username: user.username });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Rota para criar uma nova sala
app.post('/api/salas', (req, res) => {
  const { nome, criador_id } = req.body;
  if (!nome || !criador_id) {
    return res.status(400).json({ message: 'Nome da sala e ID do criador são obrigatórios.' });
  }
  db.run('INSERT INTO Salas (nome, criador_id) VALUES (?, ?)', [nome, criador_id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao criar a sala.' });
    }
    const salaId = this.lastID;
    res.status(201).json({ message: 'Sala criada com sucesso!', salaId: salaId });
    io.emit('novaSala', { id: salaId, nome });
  });
});

// Rota para buscar todas as salas
app.get('/api/salas', (req, res) => {
  db.all('SELECT * FROM Salas', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao buscar as salas.' });
    }
    res.status(200).json(rows);
  });
});

// Rota para enviar uma nova mensagem de texto
app.post('/api/mensagens', (req, res) => {
  const { texto, usuario_id, sala_id } = req.body;
  if (!texto || !usuario_id || !sala_id) {
    return res.status(400).json({ message: 'Texto, ID do usuário e ID da sala são obrigatórios.' });
  }
  db.run('INSERT INTO Mensagens (texto, usuario_id, sala_id) VALUES (?, ?, ?)', [texto, usuario_id, sala_id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao enviar a mensagem.' });
    }
    db.get('SELECT username FROM Usuarios WHERE id = ?', [usuario_id], (err, user) => {
      if (err || !user) {
        console.error(err || 'Usuário não encontrado.');
        return res.status(500).json({ message: 'Erro ao buscar o usuário.' });
      }
      const mensagemCompleta = {
        texto,
        username: user.username,
        data_hora: new Date().toISOString(),
        tipo: 'texto',
        url_anexo: null
      };
      io.to(sala_id).emit('novaMensagem', mensagemCompleta);
      res.status(201).json({ message: 'Mensagem enviada com sucesso!' });
    });
  });
});

// Rota para upload e envio de uma nova mensagem com imagem
app.post('/api/upload-imagem', upload.single('imagem'), (req, res) => {
  const { usuario_id, sala_id } = req.body;
  const url_anexo = req.file ? `/uploads/${req.file.filename}` : null;

  if (!usuario_id || !sala_id || !url_anexo) {
    return res.status(400).json({ message: 'ID do usuário, ID da sala e arquivo são obrigatórios.' });
  }

  db.run('INSERT INTO Mensagens (tipo, url_anexo, usuario_id, sala_id) VALUES (?, ?, ?, ?)', ['imagem', url_anexo, usuario_id, sala_id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao enviar a imagem.' });
    }
    db.get('SELECT username FROM Usuarios WHERE id = ?', [usuario_id], (err, user) => {
      if (err || !user) {
        console.error(err || 'Usuário não encontrado.');
        return res.status(500).json({ message: 'Erro ao buscar o usuário.' });
      }
      const mensagemCompleta = {
        tipo: 'imagem',
        url_anexo,
        username: user.username,
        data_hora: new Date().toISOString(),
      };
      io.to(sala_id).emit('novaMensagem', mensagemCompleta);
      res.status(201).json({ message: 'Imagem enviada com sucesso!' });
    });
  });
});

// Rota para buscar as mensagens de uma sala
app.get('/api/mensagens/:salaId', (req, res) => {
  const { salaId } = req.params;
  db.all(
    'SELECT Mensagens.texto, Mensagens.tipo, Mensagens.url_anexo, Usuarios.username, Mensagens.data_hora FROM Mensagens JOIN Usuarios ON Mensagens.usuario_id = Usuarios.id WHERE Mensagens.sala_id = ? ORDER BY Mensagens.data_hora ASC',
    [salaId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao buscar as mensagens.' });
      }
      res.status(200).json(rows);
    }
  );
});

// Configuração do Socket.io
io.on('connection', (socket) => {
  console.log('Um usuário se conectou.');

  socket.on('entrarSala', (data) => {
    const { salaId, username } = data;
    socket.join(salaId);
    socket.username = username;
    console.log(`Usuário ${username} entrou na sala: ${salaId}`);
    emitirUsuariosOnline(salaId);
  });

  socket.on('sairSala', (salaId) => {
    const username = socket.username;
    socket.leave(salaId);
    console.log(`Usuário ${username} saiu da sala: ${salaId}`);
    emitirUsuariosOnline(salaId);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado.');
  });
});

const emitirUsuariosOnline = (salaId) => {
  if (io.sockets.adapter.rooms.get(salaId)) {
    const socketsNaSala = Array.from(io.sockets.adapter.rooms.get(salaId));
    const usernames = socketsNaSala.map(socketId => io.sockets.sockets.get(socketId).username);
    io.to(salaId).emit('usuariosOnline', usernames);
  }
};

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});