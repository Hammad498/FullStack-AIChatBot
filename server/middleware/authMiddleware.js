import jwt from 'jsonwebtoken';
import User from '../models/User.js';



const authMiddleware = async (req, res, next) => {
    try {
        const token=req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
        
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


export default authMiddleware;