// client/src/pages/MessageListPage.tsx

import React from "react";
import { Link } from "react-router-dom";

interface Conversation {
  roomId: string;
  otherUserId: string;
  lastMessage: string;
}

const MessageListPage: React.FC = () => {
  // For demonstration, we'll create a static list of conversations.
  const conversations: Conversation[] = [
    {
      roomId: "user1_user2",
      otherUserId: "user2",
      lastMessage: "Hey, how are you?",
    },
    {
      roomId: "user1_user3",
      otherUserId: "user3",
      lastMessage: "Did you check out my post?",
    },
  ];

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Your Conversations</h2>
      {conversations.map((conv) => (
        <div
          key={conv.roomId}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p>
              <strong>Chat with: {conv.otherUserId}</strong>
            </p>
            <p>{conv.lastMessage}</p>
          </div>
          <Link
            to={`/chat/${conv.otherUserId}`}
            style={{ textDecoration: "none", color: "#007bff" }}
          >
            Open Chat
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MessageListPage;
