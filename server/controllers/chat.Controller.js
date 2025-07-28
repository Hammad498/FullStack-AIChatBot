
import  Chat  from "../models/Chat.js";
import dotenv from "dotenv";
import {handleChatCreation,handleImageChatCreation} from "../services/chat.Services.js";



dotenv.config();



export const getUserAllChat=async(req,res)=>{
    try {
        const chat=await Chat.find({user:req.user._id}).sort({updatedAt:-1});
        return res.status(200).json(chat);
    } catch (error) {
        console.error("Error fetching user chats:", error);
        return res.status(500).json({ error: "Failed to fetch user chats" });
    }
}


export const createChat = async (req, res) => {
    const { chatId, message } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required and must be valid." });
    }

    try {
        const result = await handleChatCreation({
            chatId,
            message,
            userId: req.user._id
        });

        if (result.chat) {
            return res.status(201).json(result);
        } else {
            return res.status(200).json(result);
        }
    } catch (error) {
        console.error("Error creating chat:", error);
        const status = error.status || 500;
        const message = error.message || "Failed to create chat";
        return res.status(status).json({ error: message });
    }
};

///////////////////////////////////////////


export const deleteChat=async(req,res)=>{
    try {
        const deleted=await Chat.findOneAndDelete({
            _id:req.params.id,
            user:req.user._id
        });
        if(!deleted) return res.status(404).json({error:"Chat not found."});
        return res.status(200).json({message:"Chat deleted successfully."});
    } catch (error) {
        console.error("Error deleting chat:", error);
        return res.status(500).json({ error: "Failed to delete chat" });
    }
}




export const getUserChat=async(req,res)=>{
    try {
        const chat=await Chat.findOne({
            _id:req.params.id,
            user:req.user._id
        });
        if(!chat) return res.status(404).json({error:"Chat not found."});
        return res.status(200).json(chat);
    } catch (error) {
        console.error("Error fetching user chat:", error);
        return res.status(500).json({ error: "Failed to fetch user chat" });
    }
}




/////////////////////////




export const createImageChat = async (req, res) => {
  try {
   const {message,  chatId } = req.body;
    const userId = req.user._id;
    const files = req.files;

    const { aiReply, chat } = await handleImageChatCreation({message, chatId,  files, userId });

    return res.status(201).json({ reply: aiReply, chat, chatId: chat?._id || chatId });

  } catch (error) {
    console.error("createImageChat error:");
    res.status(500).json({ error: "Something went wrong." });
  }
};



//////////////////////

