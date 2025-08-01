import { Router } from "express";
import { loginUser, registerUser,logOutUser,getAllLogedInUsers } from "../controllers/auth.Controller.js";
import { validateEmailMiddleware } from "../validation/userValidation.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {authToken} from '../controllers/3rdPartyAuthControllers/googleAuth.Controller.js'

const router=Router();


router.post("/login",validateEmailMiddleware,loginUser);
router.post("/register",validateEmailMiddleware ,registerUser);


//logout
router.post('/logout',logOutUser);



///for dev test
router.get("/getUsers",authMiddleware,getAllLogedInUsers);


router.post("/authToken",authToken);





export default router;