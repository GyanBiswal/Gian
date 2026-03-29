import express from "express";
import {
  createChat,
  sendMessage,
  getChats,
  getChatById,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/create", createChat);
router.post("/message", sendMessage);
router.get("/:userId", getChats);
router.get("/single/:chatId", getChatById);

export default router;