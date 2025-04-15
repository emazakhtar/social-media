// client/src/pages/FriendsPage.tsx

import React, { useState, useEffect } from "react";

interface Friend {
  _id: string;
  username: string;
  email: string;
}

const FriendsPage: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState<string>("");
  // Assume currentUserId is stored in localStorage from login.
  const currentUserId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("token") || "";

  // Fetch friends list from the backend.
  const fetchFriends = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/friends/${currentUserId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Here we attach the token
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to fetch friends.");
      } else {
        setFriends(data.friends || []);
      }
    } catch (err) {
      setError("An error occurred while fetching friends.");
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [currentUserId]);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Your Friends</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {friends.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        friends.map((friend) => (
          <div
            key={friend._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          >
            <p>
              <strong>{friend.username}</strong>
            </p>
            <p>{friend.email}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendsPage;
