import Router from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createChatRag } from "../controllers/ragChat.Controller.js";


const router=Router();


router.post("/aiChat/createChat",authMiddleware,createChatRag);


export default router;