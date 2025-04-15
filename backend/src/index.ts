import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";

// Import custom modules
import { initializeSocket } from "./sockets";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import postRoutes from "./routes/posts";
import friendsRoutes from "./routes/friends";
import usersRoutes from "./routes/users";
import { errorHandler } from "./middlewares/errorHandler";
import { protect } from "./middlewares/authMiddleware";

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Social Media App Server!");
});

// Database connection
connectDB();

// HTTP and Socket.IO server setup
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeSocket(io);

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", protect, profileRoutes);
app.use("/api/posts", protect, postRoutes);
app.use("/api/friends", protect, friendsRoutes);
app.use("/api/users", protect, usersRoutes);

// Error handler middleware (should be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
