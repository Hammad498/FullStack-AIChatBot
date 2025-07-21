import axios from "axios";
import  Chat  from "../models/Chat.js";
import dotenv from "dotenv";
dotenv.config();


const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export const AIResponse=async(message)=>{
    try {
        
        const response=await axios.post(process.env.AIResponse_URL,{
            model:process.env.MODEL,
            messages:[
                {role:"system",content:"You are a helpful assistant."},
                {role:"user",content:message}
            ],
        },
        {
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${OPENROUTER_API_KEY}`
            }
        }
    );
    return response.data?.choices?.[0]?.message?.content ||  "NO response";
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return res.status(500).json({ error: "Failed to fetch AI response" });
    }
}






///all chats of loggedIn user
export const getUserAllChat=async(req,res)=>{
    try {
        const chat=await Chat.find({user:req.user._id}).sort({updatedAt:-1});
        return res.status(200).json(chat);
    } catch (error) {
        console.error("Error fetching user chats:", error);
        return res.status(500).json({ error: "Failed to fetch user chats" });
    }
}






export const createChat=async(req,res)=>{
    const {chatId,message}=req.body;
    if(!message || typeof message !== 'string'){
        return res.status(400).json({error:"Message is required and must be valid."});
    }

    try {
        const aiResponse=await AIResponse(message);

        if(chatId){
            const chat=await Chat.findOne({_id:chatId,user:req.user._id});
            if(!chat) return res.status(404).json({error:"Chat not found."});

            chat.message.push({role:"user",content:message});
            chat.message.push({role:"assistant",content:aiResponse});
            await chat.save();
            return res.status(200).json({reply:aiResponse,chatId});
        }else{
             const cleanedTitle = message.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 30);

             const newChat=await Chat.create({
                title: cleanedTitle || "Untitled Chat",
                message:[
                    {role:"user",content:message},
                    {role:"assistant",content:aiResponse}
                ],
                user:req.user._id
             });
             await newChat.save();
        return res.status(201).json({ chat: newChat, reply: aiResponse });
               
        };
    } catch (error) {
        console.error("Error creating chat:", error);
        return res.status(500).json({ error: "Failed to create chat" });
    }
}




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