import React, { useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext.jsx';
import { SocketContext } from './socketContext.js';
import io from 'socket.io-client';

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!authUser) return undefined;

    const socketUrl = import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin;
    const activeSocket = io(socketUrl, { query: { userId: authUser._id } });
    activeSocket.on('connect', () => setSocket(activeSocket));
    activeSocket.on('getOnlineUsers', setOnlineUsers);
    activeSocket.on('disconnect', () => {
      setSocket(null);
      setOnlineUsers([]);
    });
    return () => activeSocket.close();
  }, [authUser]);

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
