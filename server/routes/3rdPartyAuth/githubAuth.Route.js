import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {githubCallbackController} from '../../controllers/3rdPartyAuthControllers/googleAuth.Controller.js';

const router = express.Router();

// Redirect to GitHub for login
router.get("/github", passport.authenticate("github", { scope: [ "user:email" ] }));

const url="http://localhost:3000/auth/github/callback";


//Callback from GitHub
router.get("/github/callback",
  passport.authenticate("github", {
    // successRedirect: "/success",
    failureRedirect: "/login",
    session: false,
  }),
  githubCallbackController
);






// Test routes
router.get("/success", (req, res) => {
  res.send("GitHub Login Successful!");
});

router.get("/failure", (req, res) => {
  res.send("GitHub Login Failed");
});

export default router;
