const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/matches', require('./routes/matches'));

// Socket.io logic
io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('join_match', (matchId) => {
    socket.join(`match_${matchId}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Pass io to routes if needed
app.set('io', io);
app.set('prisma', prisma);

module.exports = { app, server, io, prisma };
