import { createContext, useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    const socketInstance = io(BACKEND_URL, {
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      console.log('[SOCKET] Connected to socket server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[SOCKET] Disconnected from socket server');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('[SOCKET] Connection error:', error.message);
      console.error('[SOCKET] Full error:', error);
      setIsConnected(false);
    });

    socketInstance.on('MessageError', (error) => {
      console.error('[MESSAGE ERROR]', error);
      alert(`Message failed: ${error.error}\n${error.details || ''}`);
    });

    socketInstance.on('ConnectionError', (error) => {
      console.error('[CONNECTION ERROR]', error);
      alert(`Connection error: ${error.error}\n${error.details || ''}`);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
