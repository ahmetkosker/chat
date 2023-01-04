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
  console.log(`${socket.id} connected`);
  socket.on("new-user", (data) => {
    socket.userName = data.name;
    console.log(`${socket.userName} joined ${data.room}`);
    socket.join(data.room);
  });

  socket.on("send-chat-message", (data) => {
    data.name = socket.userName;
    console.log(`${socket.userName} sent ${data.message} to ${data.room}`);
    socket.to(data.room).emit("chat-message", data);
  });

  socket.on("leave_room", (data) => {
    console.log(`${socket.userName} left ${data.room}`);
    socket.leave(data);
    socket.to(data.room).emit("left-message", data);
  });

  socket.on("disconnect", () => {
    console.log(socket.rooms);
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
  res.send("Welcome to the chat server");
});

server.listen(3002, () => {
  console.log("server is running");
});
