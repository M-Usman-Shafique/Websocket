import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

export default function App() {
  const [room, setRoom] = useState("");
  const [roomStorage, setRoomStorage] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("msg", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("msg");
    };
  }, []);

  const joinRoom = (e) => {
    e.preventDefault();
    if (room !== "") {
      socket.emit("join-room", room);
      setRoomStorage(room);
      setRoom("");
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("send-data", { message, roomStorage });
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#242424] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-semibold mb-4">Chat App</h1>
      <form
        onSubmit={joinRoom}
        className="flex w-full max-w-lg bg-[#333333] p-4 rounded-lg shadow-lg mb-4"
      >
        <input
          type="text"
          name="room"
          value={room}
          placeholder="Enter Room Number..."
          className="w-full py-2 px-3 bg-[#444444] rounded-l-lg text-white placeholder-gray-400 focus:outline-none"
          onChange={(e) => {
            setRoom(e.target.value);
          }}
        />
        <button
          type="submit"
          className="bg-blue-500 p-2 rounded-r-lg text-white font-semibold hover:bg-blue-600 focus:outline-none"
        >
          Join Room
        </button>
      </form>

      <div className="w-full max-w-lg bg-[#333333] p-4 rounded-lg shadow-lg mb-4 overflow-auto h-72">
        <div className="space-y-2">
          {messages.length === 0 ? (
            <div className="h-[252px] flex items-center justify-center text-gray-400">
              No messages.
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="bg-[#444444] p-2 rounded-lg text-sm">
                {msg}
              </div>
            ))
          )}
        </div>
      </div>

      <form
        className="flex w-full max-w-lg bg-[#333333] p-2 rounded-lg shadow-lg"
        onSubmit={sendMessage}
      >
        <input
          type="text"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="w-full py-2 px-3 bg-[#444444] rounded-l-lg text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 p-2 rounded-r-lg text-white font-semibold hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
}
