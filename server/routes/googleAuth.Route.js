
import express from "express";
import passport from "passport";

import {googleCallbackController} from '../controllers/googleAuth.Controller.js'

const router = express.Router();

router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleCallbackController
);

export default router;
