const express = require("express");
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const initializeDBConnection = require("./db/dbconnect");
const User = require("./models/user.model");
const Room = require("./models/room.model");
const Message = require("./models/message.model");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const server = createServer(app);
const io = new Server(server);

initializeDBConnection();

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find().lean();

    const roomsWithMessages = await Promise.all(
      rooms.map(async (room) => {
        const messages = await Message.find({ room: room._id })
          .populate("sender", "name")
          .lean();
        return {
          id: room._id,
          title: room.title,
          about: room.about,
          messages: messages.map((message) => ({
            id: message._id,
            sender: message.sender.name,
            message: message.message,
          })),
        };
      })
    );

    res.json(roomsWithMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, photoURL, uid } = req.body;

    const userAlreadyExists = await User.findOne({
      uid: req.body.uid,
    });

    if (userAlreadyExists) {
      return res.status(200).json({ success: true, data: userAlreadyExists });
    } else {
      const user = new User({
        name,
        email,
        photoURL,
        uid,
      });
      const result = await user.save();
      console.log(result, "result");

      res.status(201).json({ success: true, data: user });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/rooms/:roomId/messages", async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const messages = await Message.find({ room: roomId }).populate(
      "sender",
      "name"
    );

    const formattedMessages = messages.map((message) => ({
      id: message._id,
      sender: message.sender.name,
      message: message.message,
      type: message.type,
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId, message, type } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newMessage = new Message({
      sender: userId,
      message,
      room: roomId,
      type,
    });

    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
      io.to(roomId).emit("messageReceived", { roomId, message, sender, type });
    }
  });
});

server.listen(5000, () => console.log(`Listening on port 5000`));
