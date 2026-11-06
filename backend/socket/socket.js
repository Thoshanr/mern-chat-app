import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'development'
      ? true
      : (process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((value) => value.trim()) : false),
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];
const userSocketMap = {};

io.use((socket, next) => {
  const token = (socket.handshake.headers.cookie || '')
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('jwt='))
    ?.slice(4);
  if (!token) return next(new Error('Unauthorized'));
  try {
    const decoded = jwt.verify(decodeURIComponent(token), process.env.JWT_SECRET);
    socket.userId = String(decoded.userId);
    return next();
  } catch {
    return next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.userId;
  socket.join(userId);
  userSocketMap[userId] ??= new Set();
  userSocketMap[userId].add(socket.id);
  io.emit('getOnlineUsers', Object.keys(userSocketMap));
  socket.on('disconnect', () => {
    if (userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);
      if (userSocketMap[userId].size === 0) delete userSocketMap[userId];
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { app, io, server };
