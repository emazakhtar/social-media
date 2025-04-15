// client/src/components/Chat.tsx

import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import MessageList from "./MessageList"; // We'll create this component next.
import MessageInput from "./MessageInput"; // Already built in previous chapter.
import ChatNotification from "./ChatNotification"; // Already built.

interface ChatProps {
  currentUserId: string;
  otherUserId: string;
}

interface Message {
  senderId: string;
  text: string;
  roomId: string;
  createdAt?: string;
  read: boolean; // true if the message has been read, false otherwise.
}

const Chat: React.FC<ChatProps> = ({ currentUserId, otherUserId }) => {
  // Define a unique room ID by consistently combining the two user IDs.
  const roomId =
    currentUserId < otherUserId
      ? `${currentUserId}_${otherUserId}`
      : `${otherUserId}_${currentUserId}`;

  // Initialize the socket connection with the current user's ID.
  const socket = useSocket(currentUserId);

  // State to store the chat messages.
  const [messages, setMessages] = useState<Message[]>([]);
  // State for a temporary notification (for instance, when a new message is received).
  const [notification, setNotification] = useState<string>("");

  // Once the socket is available, join the designated chat room.
  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", roomId);
      console.log(`Joined room: ${roomId}`);
    }
  }, [socket, roomId]);

  // Set up event listeners on the socket.
  useEffect(() => {
    if (!socket) return;

    // Listen for new chat messages.
    socket.on("newMessage", (data: any) => {
      // When a new message comes in, mark it as unread (read: false) before adding.
      setMessages((prev) => [...prev, { ...data, read: false }]);
    });

    // Listen for generic notifications (this might be used for chat notifications, although
    // we typically filter chat messages to the conversation window).
    socket.on("notification", (data: any) => {
      setNotification(`New message from ${data.senderId}: ${data.message}`);
      // Clear the temporary notification after 3 seconds.
      setTimeout(() => setNotification(""), 3000);
    });

    // Cleanup listeners on unmount.
    return () => {
      socket.off("newMessage");
      socket.off("notification");
    };
  }, [socket]);

  // Function to send a message.
  const handleSendMessage = (text: string) => {
    if (socket) {
      // Construct the message data.
      const messageData = {
        senderId: currentUserId,
        receiverId: otherUserId,
        roomId,
        text,
      };

      // Emit the chat message using our socket.
      socket.emit("chatMessage", messageData);

      // Since the current user is sending the message, mark it as read.
      setMessages((prev) => [...prev, { ...messageData, read: true }]);
    }
  };

  // Callback to mark all messages as read. This is called when the user clicks on the message list.
  const markMessagesAsRead = () => {
    setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
    // Optionally, an API call (or a WebSocket call) can be made here to update the message read status in the database.
  };

  return (
    <div>
      <h3>Chat Room: {roomId}</h3>
      {/* Pass the messages and the callback to the MessageList component. */}
      <MessageList
        messages={messages}
        onMarkMessagesAsRead={markMessagesAsRead}
      />
      <MessageInput onSend={handleSendMessage} />
      {notification && <ChatNotification message={notification} />}
    </div>
  );
};

export default Chat;
