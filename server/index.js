import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.status(200).send("Hello Express...");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("sms", (message) => {
    // socket.broadcast.emit("msg", message);
    io.emit("msg", message);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
