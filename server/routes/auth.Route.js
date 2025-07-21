import { Router } from "express";
import { loginUser, registerUser,logOutUser } from "../controllers/auth.Controller.js";
import { validateEmailMiddleware } from "../validation/userValidation.js";

const router=Router();


router.post("/login",validateEmailMiddleware,loginUser);
router.post("/register",validateEmailMiddleware ,registerUser);


//logout
router.post('/logout',logOutUser);



export default router;