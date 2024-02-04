const express = require("express");
const router = express.Router();
const Room = require("../models/room.model");

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().lean();

    const roomsWithoutMessages = rooms.map((room) => ({
      id: room._id,
      title: room.title,
      about: room.about,
    }));

    res.json(roomsWithoutMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
