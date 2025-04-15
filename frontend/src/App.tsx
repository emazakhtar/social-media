import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import CreatePostPage from "./pages/CreatePostPage";
import FriendsPage from "./pages/FriendsPage";
import UserSearchPage from "./pages/UserSearchPage";
import MessageListPage from "./pages/MessageListPage";
import ChatPage from "./pages/ChatPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/search" element={<UserSearchPage />} />
        <Route path="/messages" element={<MessageListPage />} />
        <Route path="/chat/:otherUserId" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
