import React, { useState, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(currentTheme);
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    setMessages([...messages, { sender: "user", text: input }]);
    const userMessage = input;
    setInput("");

    try {
      const response = await axios.post("http://localhost:1000/api/v1/chat", { message: userMessage });
      const botMessage = response.data.reply;
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: botMessage },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const containerClass = theme === "dark" ? "bg-zinc-900" : "bg-white";
  const botMessageClass = theme === "dark" ? "bg-zinc-700 text-white" : "bg-zinc-100 text-black";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleChatbot}
        className="bg-blue-500 text-white p-4 rounded-full shadow-lg"
      >
        Chat
      </button>

      {isOpen && (
        <div className={`fixed bottom-20 right-4 ${containerClass} w-80 h-96 shadow-lg rounded-lg flex flex-col`}> {/* Adjusted bottom to 20 */}
          <div className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-t-lg">
            <span>Chatbot</span>
            <button onClick={toggleChatbot} className="text-white">x</button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 p-2 rounded-md ${
                  msg.sender === "user"
                    ? "bg-green-500 text-white"
                    : botMessageClass
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex p-4 border-t border-gray-300">
            <input
              type="text"
              className={`flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none ${theme === "dark" ? "bg-zinc-700 text-white" : "bg-zinc-100 text-black"}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-md"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
