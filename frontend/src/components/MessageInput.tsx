// client/src/components/MessageInput.tsx

import React, { useState } from "react";

interface MessageInputProps {
  onSend: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [text, setText] = useState("");

  // This function is called when the send button is clicked.
  const handleSend = () => {
    // Only send if text is not empty (trim any extra spaces)
    if (text.trim() !== "") {
      onSend(text);
      // Clear the input after sending
      setText("");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <button
        onClick={handleSend}
        style={{
          marginLeft: "8px",
          padding: "8px 12px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
