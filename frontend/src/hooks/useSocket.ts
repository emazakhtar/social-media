import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

export const useSocket = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(SOCKET_SERVER_URL);
    socketIo.on("connect", () => {
      console.log("Connected to socket server:", socketIo.id);
      socketIo.emit("register", userId);
    });
    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
    };
  }, [userId]);

  return socket;
};
