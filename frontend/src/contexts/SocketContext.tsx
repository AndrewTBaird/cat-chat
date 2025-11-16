import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only connect if we're on a dashboard route (not on login/register)
    const isDashboardRoute = location.pathname.startsWith('/dashboard') || location.pathname === '/';

    if (!isDashboardRoute) {
      return;
    }

    const socketInstance = io(BACKEND_URL, {
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    socketInstance.on('MessageError', (error) => {
      console.error('Message error:', error);
      alert(`Message failed: ${error.error}\n${error.details || ''}`);
    });

    socketInstance.on('ConnectionError', (error) => {
      console.error('Connection error:', error);
      alert(`Connection error: ${error.error}\n${error.details || ''}`);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [location.pathname]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
