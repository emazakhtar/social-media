import React from "react";

interface PostProps {
  post: {
    _id: string;
    userId: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <p>{post.content}</p>
      {post.imageUrl && (
        <img
          src={`http://localhost:5000${post.imageUrl}`}
          alt="Uploaded"
          style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "10px" }}
        />
      )}
      <p style={{ fontSize: "0.8rem", color: "#555", marginTop: "10px" }}>
        Posted on: {new Date(post.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default Post;
