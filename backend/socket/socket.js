import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];
const userSocketMap = {};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== 'undefined') userSocketMap[userId] = socket.id;
  io.emit('getOnlineUsers', Object.keys(userSocketMap));
  socket.on('disconnect', () => {
    if (userSocketMap[userId] === socket.id) delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { app, io, server };
