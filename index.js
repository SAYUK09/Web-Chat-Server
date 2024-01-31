const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
console.log(server);
const io = new Server(server);

app.get("/", function (req, res) {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (room) => {
    console.log("room", room);
  });
});

server.listen(5000, () => console.log(`Listening on port 5000`));
