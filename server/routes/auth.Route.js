import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.Controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=Router();


router.post("/login",loginUser);
router.post("/register",registerUser);



export default router;