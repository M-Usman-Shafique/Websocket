// nextjs/src/app/page.js
"use client";
import { useEffect, useState } from "react";
import { socket } from "../../src/socket";

export default function Home() {
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

  const leaveRoom = () => {
    socket.emit("leave-room", roomStorage);
    setRoomStorage("");
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-[#242424] text-white flex flex-col items-center justify-center p-4">
      {roomStorage !== "" ? (
        <div className="text-3xl font-semibold mb-4">Room: {roomStorage}</div>
      ) : (
        <div className="text-3xl font-semibold mb-4">Chat Rooms</div>
      )}
      <form
        onSubmit={joinRoom}
        className="flex w-full max-w-lg bg-[#333333] p-3 rounded-t-lg shadow-lg gap-2"
      >
        <input
          type="text"
          name="room"
          value={room}
          placeholder="Enter Room Number..."
          className="flex-1 py-2 px-3 bg-[#444444] rounded-lg text-white placeholder-gray-400 focus:outline-none"
          onChange={(e) => {
            setRoom(e.target.value);
          }}
        />
        <button
          type="submit"
          className="bg-blue-500 py-2 px-4 rounded-lg text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Join
        </button>
        {roomStorage !== "" && (
          <button
            type="button"
            onClick={leaveRoom}
            className="bg-red-500 py-2 px-4 rounded-lg text-white font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Leave
          </button>
        )}
      </form>

      <div className="w-full max-w-lg bg-[#333333] p-4 shadow-lg overflow-auto h-72">
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
        className="flex w-full max-w-lg bg-[#333333] p-3 rounded-b-lg shadow-lg"
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
