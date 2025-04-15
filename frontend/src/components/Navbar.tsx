// client/src/components/Navbar.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

// Define a type for our notification object.
interface Notification {
  id: string; // Unique id for this notification.
  type: string; // E.g., "friend", "system", "chat".
  message: string;
  read: boolean;
}

const Navbar: React.FC = () => {
  // For this example, we assume the current user id is stored in localStorage.
  const currentUserId = localStorage.getItem("userId") || "unknownUser";

  // Initialize a socket connection using our custom hook.
  const socket = useSocket(currentUserId);

  // State to hold notifications and manage panel visibility.
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Compute count of unread notifications.
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Listen for incoming notifications via WebSocket.
  useEffect(() => {
    if (!socket) return;

    // The server will emit a "notification" event with a notification payload.
    const handleNotification = (data: {
      id: string;
      type: string;
      message: string;
    }) => {
      // Add new notification as unread.
      setNotifications((prev) => [
        {
          id: data.id,
          type: data.type,
          message: data.message,
          read: false, // New notification is unread.
        },
        ...prev,
      ]);
    };

    socket.on("notification", handleNotification);

    // Cleanup the listener on unmount.
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  // Function to handle toggling the notification panel.
  const toggleNotificationPanel = () => {
    setShowNotifications((prev) => !prev);
    // If opening, mark all as read (alternatively, you could mark individual ones on click)
    if (!showNotifications) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <nav
      style={{
        backgroundColor: "#333",
        padding: "10px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        color: "#fff",
        position: "relative", // This helps position the notification panel relative to navbar.
      }}
    >
      {/* Navigation links */}
      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
        Home
      </Link>
      <Link to="/profile" style={{ color: "#fff", textDecoration: "none" }}>
        Profile
      </Link>
      <Link to="/friends" style={{ color: "#fff", textDecoration: "none" }}>
        Friends
      </Link>
      <Link to="/search" style={{ color: "#fff", textDecoration: "none" }}>
        Search
      </Link>
      <Link to="/messages" style={{ color: "#fff", textDecoration: "none" }}>
        Messages
      </Link>
      <Link to="/create-post" style={{ color: "#fff", textDecoration: "none" }}>
        New Post
      </Link>

      {/* Notification Icon */}
      <div
        onClick={toggleNotificationPanel}
        style={{
          cursor: "pointer",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Simple bell icon (using Unicode or an image icon) */}
        <span style={{ fontSize: "1.5rem" }}>&#128276;</span>
        {/* Notification count badge */}
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-10px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "0.75rem",
            }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <div
          style={{
            position: "absolute",
            top: "50px", // Place below the navbar
            right: "10px",
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            backgroundColor: "#fff",
            color: "#000",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
            padding: "10px",
          }}
        >
          <h4 style={{ marginTop: 0 }}>Notifications</h4>
          {notifications.length === 0 ? (
            <p style={{ textAlign: "center" }}>No notifications</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: "8px",
                  marginBottom: "6px",
                  backgroundColor: notif.read ? "#f1f1f1" : "#e6f7ff",
                  borderRadius: "4px",
                }}
              >
                <p style={{ margin: "0 0 4px 0" }}>{notif.message}</p>
                {/* You could add a button here for "Mark as Read" if you want individual control */}
              </div>
            ))
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
