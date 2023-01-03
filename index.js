const express = require("express");
var cors = require("cors");
const http = require("http");

const app = express();
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("new-user", (data) => {
    console.log(data);
    socket.join(data);
  });

  socket.on("send-chat-message", (data) => {
    console.log(data.room);
    socket.to(data.room).emit("chat-message", data);
  });

  socket.on("leave_room", (data) => {
    socket.leave(data);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });

  socket.on("reconnect", () => {
    console.log(`${socket.id} reconnected`);
  });

  socket.on("deta", () => {
    console.log(socket.rooms);
  });
});

app.get("/", (req, res) => {
  console.log("12e3wawd");
  res.send("test");
});

app.get("/yah", (req, res) => {
  console.log("12e3wawd");
  res.send("yah");
});

server.listen(3000, () => {
  console.log("server is running");
});
