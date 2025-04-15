import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePostPage: React.FC = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };
  const token = localStorage.getItem("token") || "";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append(
        "userId",
        localStorage.getItem("userId") || "unknownUser"
      );
      if (image) formData.append("image", image);

      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Here we attach the token
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to create post.");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("An error occurred while creating the post.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Create a New Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            height: "100px",
          }}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
