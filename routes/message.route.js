const express = require("express");
const router = express.Router();
const Message = require("../models/message.model");
const Room = require("../models/room.model");
const User = require("../models/user.model");

// Get messages for a specific room
router.get("/:roomId", async (req, res) => {
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
      timestamp: message.createdAt,
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:roomId", async (req, res) => {
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

module.exports = router;
