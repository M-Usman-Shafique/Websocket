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

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("send-data", (data) => {
    if (data.roomStorage) {
      io.to(data.roomStorage).emit("msg", data.message);
    } else {
      io.emit("msg", data.message);
    }
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
