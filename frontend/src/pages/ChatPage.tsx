// client/src/pages/ChatPage.tsx

import React from "react";
import { useParams } from "react-router-dom";
import Chat from "../components/Chat";

const ChatPage: React.FC = () => {
  // Extract the other user's ID from the URL.
  const { otherUserId } = useParams<{ otherUserId: string }>();

  // Assume currentUserId is available in localStorage after login.
  const currentUserId = localStorage.getItem("userId") || "user1";

  if (!otherUserId) {
    return <p>Error: No conversation selected.</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Chat with {otherUserId}</h2>
      {/* Pass the IDs to our Chat component so it can join the proper room */}
      <Chat currentUserId={currentUserId} otherUserId={otherUserId} />
    </div>
  );
};

export default ChatPage;
