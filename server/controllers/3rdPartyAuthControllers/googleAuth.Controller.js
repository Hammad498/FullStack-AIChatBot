

import jwt from "jsonwebtoken";
import User from "../../models/User.js";


export const googleCallbackController = async (req, res) => {
  console.log("🔁 Google Callback Hit");
  console.log("👤 req.user:", req.user);
  try {
    const user = req.user;
    if (!user) {
      return res.redirect("http://localhost:5173/login?error=auth_failed");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("token for frontend google:",token);

    // Redirect to the correct frontend route with token as query param
    return res.redirect(`http://localhost:5173/oauth/callback?token=${encodeURIComponent(token)}`);
    
  } catch (error) {
    console.error("Google login error:", error);
    return res.redirect("http://localhost:5173/login?error=server_error");
  }
};


export const githubCallbackController = async (req, res) => {
  console.log("🔁 Github Callback Hit");
  console.log("👤 req.user:", req.user);
  try {
    const user = req.user;
    if (!user) {
      return res.redirect("http://localhost:5173/login?error=auth_failed");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("token for frontend github:", token);

    return res.redirect(`http://localhost:5173/oauth/callback?token=${token}`);
    
  } catch (error) {
    console.error("GitHub login error:", error);
    return res.redirect("http://localhost:5173/login?error=server_error");
  }
};








///////////////////////
//auth token that tranfered to frontend and receive from above controllers

export const authToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Failed to receive token",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); 

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unable to find the user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully verified token",
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      },
    });
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to verify token",
    });
  }
};
