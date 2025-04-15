import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import { Link } from "react-router-dom";

interface Post {
  _id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || "";

  const fetchPosts = async (query = "") => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts?search=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Here we attach the token
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to fetch posts.");
      } else {
        setPosts(data.posts);
      }
    } catch (err) {
      setError("An error occurred while fetching posts.");
    }
  };

  useEffect(() => {
    fetchPosts(search);
  }, [search]);

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2>Social Feed</h2>
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "20px" }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
      <Link to="/create-post" style={{ display: "block", marginTop: "20px" }}>
        Create a new post
      </Link>
    </div>
  );
};

export default HomePage;
