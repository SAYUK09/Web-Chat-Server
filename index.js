const express = require("express");
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const initializeDBConnection = require("./db/dbconnect");
const User = require("./models/user.model");
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

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (room) => {
    console.log("room", room);
  });
});

server.listen(5000, () => console.log(`Listening on port 5000`));
