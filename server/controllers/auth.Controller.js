
import {register,login } from "../services/auth.Services.js";

export const loginUser=async(req,res)=>{
    try {
        const user=await login(req,res);
        const { token, user: loggedInUser } = user;
        if (!loggedInUser || !token) {
            return res.status(400).json({ message: "Login failed & token generation failed" });
        }
        res.status(200).json({
            user: {
                id: loggedInUser._id,
                username: loggedInUser.username,
                email: loggedInUser.email
            },
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}









export const registerUser=async(req,res)=>{
    try {
        const user=await register(req,res);
        const { token, savedUser } = user;
        if (!savedUser  || !token) {
            return res.status(400).json({ message: "User registration failed & token generation failed" });
        }

        res.status(201).json({
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            },
            token
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}