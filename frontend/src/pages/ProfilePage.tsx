import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  // const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token") || "";
  const userId = localStorage.getItem("userId") || "";
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/profile/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Here we attach the token
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Failed to fetch profile.");
        } else {
          setProfile(data.user);
        }
      } catch (err) {
        setError("An error occurred while fetching the profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>{profile.username}'s Profile</h2>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Member Since:</strong>{" "}
        {new Date(profile.createdAt).toLocaleDateString()}
      </p>
      {/* Additional details can be added here */}
    </div>
  );
};

export default ProfilePage;
