// client/src/components/MessageList.tsx

import React from "react";

interface Message {
  senderId: string;
  text: string;
  createdAt?: string;
  read: boolean; // false if unread, true if read.
}

interface MessageListProps {
  messages: Message[];
  onMarkMessagesAsRead: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onMarkMessagesAsRead,
}) => {
  // Calculate the number of unread messages.
  const unreadCount = messages.filter((msg) => !msg.read).length;

  return (
    <div
      style={{
        maxHeight: "300px",
        overflowY: "auto",
        marginBottom: "10px",
        cursor: "pointer",
      }}
      onClick={onMarkMessagesAsRead} // When the user clicks anywhere on the message list, mark all as read.
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            padding: "8px",
            borderBottom: "1px solid #eee",
            backgroundColor: msg.read ? "#fff" : "#e6f7ff", // Highlight unread messages with a light blue background.
          }}
        >
          <strong>{msg.senderId}:</strong> {msg.text}
          {msg.createdAt && (
            <div style={{ fontSize: "0.8rem", color: "#999" }}>
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          )}
        </div>
      ))}
      <div style={{ textAlign: "right", fontWeight: "bold", marginTop: "5px" }}>
        Unread messages: {unreadCount}
      </div>
    </div>
  );
};

export default MessageList;
