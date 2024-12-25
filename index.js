import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("sms", (message) => {
    io.emit("sms", message);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
