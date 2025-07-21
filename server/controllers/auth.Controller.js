
import {register,login } from "../services/auth.Services.js";

export const loginUser = async (req, res) => {
    try {
        const { token, user: loggedInUser, error } = await login(req, res);

        if (error) {
            return res.status(400).json({ message: error });
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
        console.error("Login controller error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};









export const registerUser = async (req, res) => {
    try {
        const { token, savedUser, error } = await register(req, res);

        if (error) {
            return res.status(400).json({ message: error });
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
        console.error("Controller registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};






export const logOutUser=(req,res)=>{
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}