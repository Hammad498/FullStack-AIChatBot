
import User from '../models/User.js';
import { hashPassword, comparePassword, generateToken } from '../utils/authUtils.js';




///////////////////////////////



export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return { error: "All fields are required" };
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return { error: "User already exists" };
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        const token = generateToken(savedUser._id);

        return { token, savedUser };

    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Internal server error" };
    }
};

////////////////////////////





export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return { error: "Email and password are required" };
        }

        const user = await User.findOne({ email });
        if (!user) {
            return { error: "User not found" };
        }


        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return { error: "Invalid credentials" };
        }

        const token = generateToken(user._id);

        return {
            token,
            user
        };

    } catch (error) {
        console.error("Login error:", error);
        return { error: "Internal server error" };
    }
};
