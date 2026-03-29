import Chat from "../models/chat.model.js";

// ➕ Create new chat
export const createChat = async (req, res) => {
  try {
    const { userId } = req.body;

    // 🧠 prevent duplicate empty chats
    const existingEmptyChat = await Chat.findOne({
      userId,
      messages: { $size: 0 },
    });

    if (existingEmptyChat) {
      return res.json(existingEmptyChat);
    }

    const chat = await Chat.create({
      userId,
      title: "New Chat",
      messages: [],
    });

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 💬 Send message (user + mock AI reply)
export const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // 👤 user message
    chat.messages.push({
      role: "user",
      content: message,
    });

    // 🤖 mock assistant response (replace with Gemini later)
    chat.messages.push({
      role: "assistant",
      content: "This is a mock AI response 🤖",
    });

    await chat.save();

    // return latest state
    const updatedChat = await Chat.findById(chatId);

    res.json(updatedChat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 Get all chats for user (sorted latest first)
export const getChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Get single chat by id (IMPORTANT for sidebar click)
export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};