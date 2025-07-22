

import Chat from "../models/Chat.js";
import fs from "fs/promises";
import { AIResponseImage,AIResponse } from "../utils/aiResponse.js";



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

  
  const aiReply = await AIResponseImage(message, imagesBase64);

  const chat = await Chat.create({
    title: message?.slice(0, 30) || "Image Analysis",
    message: [
      { role: "user", content: message || "Uploaded image(s)" },
      { role: "assistant", content: aiReply }
    ],
    user: userId
  });

  return { aiReply, chat };
};
