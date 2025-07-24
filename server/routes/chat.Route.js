

import Router from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';
import { enforceDailyUploadLimit, validateImageUpload, validateWordCount } from '../validation/aiResponseValidation.js';
import { 
    getUserAllChat, 
    createChat, 
    deleteChat, 
    getUserChat,
    createImageChat,
} from '../controllers/chat.Controller.js';


const router=Router();




router.get("/getUserAllChats",authMiddleware,getUserAllChat);


router.post("/createMsg",authMiddleware,createChat);


router.post(
  "/uploadImageChat",
  authMiddleware,
  upload.array("images", 6),
  validateImageUpload(6),
  validateWordCount(50),
  enforceDailyUploadLimit,
  createImageChat
);


router.delete("/deleteChat/:id",authMiddleware,deleteChat);

router.get("/getUserChat/:id",authMiddleware,getUserChat);

// router.post("/createChat",authMiddleware,validateWordCount(50),createChatRag);


export default router;