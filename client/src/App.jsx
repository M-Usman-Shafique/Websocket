import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

export default function App() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("sms", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#242424] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-semibold mb-4">Chat App</h1>

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
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="w-full p-2 bg-[#444444] rounded-l-lg text-white placeholder-gray-400 focus:outline-none"
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
