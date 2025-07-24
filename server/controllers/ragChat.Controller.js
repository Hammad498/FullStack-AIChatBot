

import { retrieveContext } from "../services/ragChat.Services.js";

export const createChatRag = async (req, res) => {
  try {
    const { messages } = req.body;
    const latestMessage = messages[messages.length - 1]?.content;

    if (!latestMessage) {
      return res.status(400).json({ error: "No message provided." });
    }

    const contextChunks = await retrieveContext(latestMessage);
    const context = contextChunks.join("\n\n");

    const responseMsg = {
      role: "assistant",
      content: context
        ? `${context}`
        : `Sorry, I couldn't find relevant results for: "${latestMessage}"`
    };

    res.json({ messages: [...messages, responseMsg] });
  } catch (error) {
    console.error("❌ Error creating chat RAG:", error);
    res.status(500).json({ error: "Failed to create chat RAG" });
  }
};
