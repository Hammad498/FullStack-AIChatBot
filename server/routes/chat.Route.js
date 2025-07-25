

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
  upload.array("images", 8),
  validateImageUpload(8),
  enforceDailyUploadLimit,
  validateWordCount(50),
  createImageChat
);


router.delete("/deleteChat/:id",authMiddleware,deleteChat);

router.get("/getUserChat/:id",authMiddleware,getUserChat);




export default router;