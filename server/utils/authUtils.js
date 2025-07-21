import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



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