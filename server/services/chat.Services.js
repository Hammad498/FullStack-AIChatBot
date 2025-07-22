
import AIResponse from "../utils/aiResponse.js";
import Chat from "../models/Chat.js";
import fs from "fs/promises";
import AIResponseImage from "../utils/aiResponse.js";



export const handleChatCreation = async ({ chatId, message, userId }) => {
    const aiResponse = await AIResponse(message);

    if (chatId) {
        const existingChat = await Chat.findOne({ _id: chatId, user: userId });
        if (!existingChat) {
            throw { status: 404, message: "Chat not found." };
        }

        existingChat.message.push({ role: "user", content: message });
        existingChat.message.push({ role: "assistant", content: aiResponse });

        await existingChat.save();

        return { reply: aiResponse, chatId };

        
    } else {
        const cleanedTitle = message.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 30);
        const newChat = await Chat.create({
            title: cleanedTitle || "Untitled Chat",
            message: [
                { role: "user", content: message },
                { role: "assistant", content: aiResponse }
            ],
            user: userId
        });

        await newChat.save();

        return { chat: newChat, reply: aiResponse };
    }
};

///////////////////////////////////


export const handleImageChatCreation = async ({ message, files, userId }) => {
  


  const imagesBase64 = await Promise.all(
    files.map(async (file) => {
      const buffer = await fs.readFile(file.path);
      return `data:${file.mimetype};base64,${buffer.toString("base64")}`;
    })
  );

  // Construct prompt
  const prompt = `
${message ? `User question: ${message}\n\n` : ""}
These are the image(s) the user uploaded. Please analyze them and provide helpful feedback.
`;

  const fullMessage = prompt + imagesBase64.map((_, i) => `[Image ${i + 1}]`).join("\n");

  // Get AI reply
  const aiReply = await AIResponseImage(fullMessage);

  // Save chat to DB
  const chat = await Chat.create({
    title: message?.slice(0, 30) || "Image Analysis",
    message: [
      { role: "user", content: message || "Uploaded image(s)" },
      { role: "assistant", content: aiReply }
    ],
    user: userId,
  });

  return { aiReply, chat };
};