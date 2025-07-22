import dotenv from "dotenv";
import axios from "axios";
import redisClient from "../config/redisClient.js";
import crypto from "crypto";
dotenv.config();



export const AIResponse = async (message) => {

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




export const AIResponseImage = async (message, base64Images) => {
  try {
    const content = [];

    if (message) {
      content.push({ type: "text", text: message });
    }

    base64Images.forEach((img) => {
      content.push({
        type: "image_url", 
        image_url: { url: img } 
      });
    });

    const response = await axios.post(
      process.env.AIResponse_URL,
      {
        model: process.env.IMAGE_MODEL,
        messages: [
          {
            role: "user",
            content 
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
        }
      }
    );

    return response.data?.choices?.[0]?.message?.content || "NO response";
  } catch (error) {
    console.error("Error fetching AI response:", error.response?.data || error.message);
    throw new Error("Failed to fetch AI response");
  }
};















