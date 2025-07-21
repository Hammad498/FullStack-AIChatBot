import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import User from '../models/User.js';


export const hashPassword = async (password) => {
    const saltRounds=10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;

};


export const comparePassword=async(password,hashedPassword)=>{
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};


export const generateToken=(userId)=>{
    
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    return token;
}





export const register=async(req,res)=>{
    try{
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();
        const token = generateToken(savedUser._id);
    }catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

////////////////////////////




export const login =async(req,res)=>{
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            
            return res.status(401).json({ message: "Invalid credentials" });
        };
        const token = generateToken(user._id);
        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}