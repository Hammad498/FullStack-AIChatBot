

///1. getAIResponse    2.getAllUsersChat 3.createChat 4.deleteChat 5.getUserChat

import Router from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUserAllChat, createChat, deleteChat, getUserChat} from '../controllers/chat.Controller.js';


const router=Router();




router.get("/getUserAllChats",authMiddleware,getUserAllChat);


router.post("/createMsg",authMiddleware,createChat);

router.delete("/deleteChat/:id",authMiddleware,deleteChat);

router.get("/getUserChat/:id",authMiddleware,getUserChat);


export default router;