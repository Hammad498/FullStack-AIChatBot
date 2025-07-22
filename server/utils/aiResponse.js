import dotenv from "dotenv";
import axios from "axios";
import redisClient from "../config/redisClient.js";
import crypto from "crypto";
dotenv.config();



const AIResponse = async (message) => {

    const hash=crypto.createHash('sha256').update(message).digest('hex');
    const cacheKey=`ai:${hash}`;
    const cached=await redisClient.get(cacheKey);
    if (cached) {
    console.log(" Serving from cache");
    return cached;
     } else {
    console.log(" Cache miss, generating AI response");
   }




    try {
        const response = await axios.post(
            process.env.AIResponse_URL,
            {
                model: process.env.MODEL,
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: message }
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
                }
            }
        );
        console.log("Model:", process.env.MODEL);
        console.log("API Key:", process.env.OPENROUTER_API_KEY ? " Loaded" : " Missing");


        const aiReply=response.data?.choices?.[0]?.message?.content || "NO response";


        await redisClient.setEx(cacheKey,3600,aiReply);

        return aiReply;



    } catch (error) {
        console.error("Error fetching AI response:", error.response?.data || error.message);
        throw new Error("Failed to fetch AI response");
    }
};
////////////////////////

//qwen2.5-vl-3b-instruct:free


const AIResponseImage=async(message)=>{
    try {
        const response = await axios.post(
            process.env.AIResponse_URL,
            {
                model: "qwen2.5-vl-3b-instruct:free",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: message }
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
                }
            }
        );
        console.log("Model:", process.env.MODEL);
        console.log("API Key:", process.env.OPENROUTER_API_KEY ? " Loaded" : " Missing");


        const aiReply=response.data?.choices?.[0]?.message?.content || "NO response";


        await redisClient.setEx(cacheKey,3600,aiReply);

        return aiReply;



    } catch (error) {
        console.error("Error fetching AI response:", error.response?.data || error.message);
        throw new Error("Failed to fetch AI response");
    }
}









export default {AIResponse,AIResponseImage};






