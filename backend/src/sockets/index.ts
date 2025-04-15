import { Server, Socket } from "socket.io";

const onlineUsers = new Map<string, string>(); // userId -> socket.id

export const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    socket.on("register", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on(
      "sendNotification",
      (data: { receiverId: string; type: string; message: string }) => {
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("notification", data);
          console.log(
            `Notification sent to user ${data.receiverId} at socket ${receiverSocketId}`
          );
        }
      }
    );

    socket.on(
      "chatMessage",
      (data: {
        senderId: string;
        receiverId: string;
        roomId: string;
        text: string;
      }) => {
        io.to(data.roomId).emit("newMessage", data);
        console.log(
          `Message from ${data.senderId} in room ${data.roomId}: ${data.text}`
        );
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId && receiverSocketId !== socket.id) {
          io.to(receiverSocketId).emit("notification", {
            receiverId: data.receiverId,
            type: "chat",
            message: `New message from ${data.senderId}`,
          });
        }
      }
    );

    socket.on("disconnect", () => {
      onlineUsers.forEach((id, userId) => {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          console.log(
            `User ${userId} disconnected and removed from online users.`
          );
        }
      });
    });
  });
};
