



import express from "express";
import passport from "passport";
import { googleCallbackController } from "../../controllers/3rdPartyAuthControllers/googleAuth.Controller.js";

const router = express.Router();

// Step 1: Redirect user to Google login
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Handle Google callback
router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://localhost:5173/login?error=auth_failed",
        session: false,
    }),
    googleCallbackController
);

export default router;