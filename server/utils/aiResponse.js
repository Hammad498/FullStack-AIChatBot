import dotenv from "dotenv";
import axios from "axios";
dotenv.config();



const AIResponse = async (message) => {
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


        return response.data?.choices?.[0]?.message?.content || "NO response";
    } catch (error) {
        console.error("Error fetching AI response:", error.response?.data || error.message);
        throw new Error("Failed to fetch AI response");
    }
};


export default AIResponse;