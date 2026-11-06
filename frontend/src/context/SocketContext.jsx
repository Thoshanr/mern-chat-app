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

    // Use the page's origin so phones on the same Wi-Fi connect through Vite's
    // /socket.io proxy instead of trying to reach their own localhost.
    const activeSocket = io(window.location.origin, {
      path: '/socket.io',
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
    });
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
