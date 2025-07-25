

import { retrieveContext } from "../services/ragChat.Services.js";
import { getLLMAnswer } from "../services/llmService.js";

export const createChatRag = async (req, res) => {
  try {
    const { messages } = req.body;
    const latestMessage = messages[messages.length - 1]?.content;

    if (!latestMessage) {
      return res.status(400).json({ error: "No message provided." });
    }

    const contextChunks = await retrieveContext(latestMessage);
    const context = contextChunks.join("\n\n");

    const prompt = `
You are an AI assistant. Use the context below to answer the user's question. 
If the answer cannot be found in the context, just say "I don't know."

Context:
${context}

Question: ${latestMessage}
`;


    const llmAnswer = await getLLMAnswer(prompt);

    const responseMsg = {
      role: "assistant",
      content: llmAnswer || `Sorry, I couldn't find relevant results for: "${latestMessage}"`,
    };

    res.json({ messages: [...messages, responseMsg] });
  } catch (error) {
    console.error("Error creating chat RAG:", error);
    res.status(500).json({ error: "Failed to create chat RAG" });
  }
};
