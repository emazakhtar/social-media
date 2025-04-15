import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

const NotificationBar: React.FC = () => {
  const currentUserId = localStorage.getItem("userId") || "unknownUser";
  const socket = useSocket(currentUserId);
  const [notifications, setNotifications] = useState<
    { type: string; message: string }[]
  >([]);

  useEffect(() => {
    if (!socket) return;
    const handleNotification = (data: { type: string; message: string }) => {
      setNotifications((prev) => [...prev, data]);
      setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 5000);
    };
    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  return (
    <div
      style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}
    >
      {notifications.map((note, index) => (
        <div
          key={index}
          style={{
            background: "#ffd700",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            minWidth: "200px",
            textAlign: "center",
          }}
        >
          <p>
            <strong>{note.type.toUpperCase()}</strong>
          </p>
          <p>{note.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationBar;
