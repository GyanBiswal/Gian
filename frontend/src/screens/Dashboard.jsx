import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "../config/axios";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 Load all chats (SIDEBAR)
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(`/chat/${user.id}`);
        setChats(res.data);

        // 🧠 ONLY auto-select if not already selected
        if (!chatId && res.data.length > 0) {
          setChatId(res.data[0]._id);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, [user?.id]); // 🔥 IMPORTANT FIX

  // 💬 Load messages when chat changes
  useEffect(() => {
    const fetchChat = async () => {
      if (!chatId) return;

      try {
        const res = await axios.get(`/chat/single/${chatId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching chat:", err);
      }
    };

    fetchChat();
  }, [chatId]);

  // ➕ New chat
  const handleNewChat = async () => {
    try {
      const res = await axios.post("/chat/create", {
        userId: user.id,
      });

      setChats((prev) => [res.data, ...prev]);
      setChatId(res.data._id);
      setMessages([]);
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  // 💬 Send message
  const handleSend = async () => {
    if (!input.trim() || !chatId) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/chat/message", {
        chatId,
        message: input,
      });

      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error getting response 😢",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-black text-white overflow-hidden">
      {/* 🌌 Sidebar */}
      <div className="w-64 bg-white/[0.03] border-r border-white/10 p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">
          🤖 {user?.email || "Agent"}
        </h2>

        {/* New Chat */}
        <button
          onClick={handleNewChat}
          className="mb-3 p-2 rounded-lg bg-white text-black"
        >
          + New Chat
        </button>

        {/* Chat List */}
        <div className="space-y-2 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setChatId(chat._id)}
              className={`p-2 rounded-lg cursor-pointer ${
                chatId === chat._id
                  ? "bg-white text-black"
                  : "hover:bg-white/10"
              }`}
            >
              {chat.title || "New Chat"}
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-auto p-2 rounded-lg bg-red-500 text-white"
        >
          Logout
        </button>
      </div>

      {/* 💬 Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg">Chat</h2>
          <span className="text-gray-400 text-sm">{user?.name || "User"}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-xl p-3 rounded-xl ${
                msg.role === "user"
                  ? "ml-auto bg-white text-black"
                  : "bg-white/[0.05]"
              }`}
            >
              {msg.content}
            </motion.div>
          ))}

          {loading && (
            <div className="bg-white/[0.05] p-3 rounded-xl w-fit">
              Thinking... 🤖
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-xl bg-white/[0.05] outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="px-5 rounded-xl bg-white text-black"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
