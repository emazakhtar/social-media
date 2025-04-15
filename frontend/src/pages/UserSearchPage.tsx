// client/src/pages/UserSearchPage.tsx

import React, { useState, useEffect } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
}

const UserSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  // Assume currentUserId is stored in localStorage.
  const currentUserId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("token") || "";

  // Function to search users from the backend.
  const fetchUsers = async (query = "") => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users?search=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Here we attach the token
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to search users.");
      } else {
        setUsers(data.users);
      }
    } catch (err) {
      setError("An error occurred while searching.");
    }
  };

  useEffect(() => {
    // Trigger search every time the query changes.
    fetchUsers(searchQuery);
  }, [searchQuery]);

  // Function to send a friend request (for simplicity, directly add friend).
  const addFriend = async (friendId: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/friends/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, friendId }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to add friend.");
      } else {
        alert("Friend added successfully!");
      }
    } catch (err) {
      alert("An error occurred while adding friend.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Search Users</h2>
      <input
        type="text"
        placeholder="Enter username or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "8px",
          marginBottom: "20px",
        }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
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
                <strong>{user.username}</strong>
              </p>
              <p>{user.email}</p>
            </div>
            <button
              onClick={() => addFriend(user._id)}
              style={{ padding: "6px 10px" }}
            >
              Add Friend
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default UserSearchPage;
