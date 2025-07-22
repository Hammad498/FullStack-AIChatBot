

import Router from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';
import { 
    getUserAllChat, 
    createChat, 
    deleteChat, 
    getUserChat
} from '../controllers/chat.Controller.js';


const router=Router();




router.get("/getUserAllChats",authMiddleware,getUserAllChat);


router.post("/createMsg",authMiddleware,upload.single('file'),createChat);

router.delete("/deleteChat/:id",authMiddleware,deleteChat);

router.get("/getUserChat/:id",authMiddleware,getUserChat);


export default router;