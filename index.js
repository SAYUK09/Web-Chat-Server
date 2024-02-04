const express = require("express");
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const initializeDBConnection = require("./db/dbconnect");
const roomsRoute = require("./routes/room.route");
const messagesRoute = require("./routes/message.route");
const usersRoute = require("./routes/user.route");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server);

initializeDBConnection();

app.use("/rooms", roomsRoute);
app.use("/users", usersRoute);
app.use("/messages", messagesRoute);

app.get("/", function (req, res) {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("New client connected");

  let currentRoom = null;

  socket.on("join", (roomId) => {
    if (currentRoom) {
      socket.leave(currentRoom);
    }
    currentRoom = roomId;
    socket.join(roomId);
    console.log("User joined room:", roomId);
  });

  socket.on("sendMessage", ({ roomId, message, sender, type }) => {
    console.log(roomId, message, sender, type);
    if (roomId === currentRoom) {
      const timestamp = new Date().toISOString();
      io.to(roomId).emit("messageReceived", {
        roomId,
        message,
        sender,
        type,
        timestamp,
      });
    }
  });
});

server.listen(5000, () => console.log(`Listening on port 5000`));
