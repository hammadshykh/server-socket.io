const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(express.json());

const server = http.createServer(app);

app.use(
 cors({
  origin: ["https://real-time-chat-socket-io.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true,
 })
);

const io = new Server(server, {
 cors: {
  origin: ["https://real-time-chat-socket-io.vercel.app"],
 },
 methods: ["GET", "POST"],
});

io.on("connection", (socket) => {
 console.log("A user connected:", socket.id);

 // Listen for messages from clients
 socket.on("sendMessage", (message) => {
  // Broadcast to all except sender
  socket.broadcast.emit("receiveMessage", message);
  // Optionally, you can also emit to sender for confirmation (not needed here)
 });

 socket.on("disconnect", () => {
  console.log("User Disconnected:", socket.id);
 });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
