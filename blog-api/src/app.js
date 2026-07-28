require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const teachersRouter = require('./routes/teachers');
const studentsRouter = require('./routes/students');

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 conexão com banco (dinâmica por ambiente)
if (process.env.NODE_ENV !== 'test') {
  const uri =
    process.env.NODE_ENV === 'production'
      ? process.env.MONGODB_URI
      : process.env.MONGODB_URI_LOCAL;

  mongoose
    .connect(uri)
    .then(() => console.log('MongoDB conectado:', uri))
    .catch((err) => {
      console.error('Erro ao conectar no MongoDB:', err.message);
      process.exit(1);
    });
}

// health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// rotas
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/teachers', teachersRouter);
app.use('/students', studentsRouter);

// 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Rota não encontrada.' })
);

// erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
});

module.exports = app;