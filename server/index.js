
///////////////////////////////
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import redisClient from "./config/redisClient.js";
import cors from "cors";

////////////////////////////////
///////////////////////////////
import passport from 'passport';
import './config/authPassport/googlePassport.js';
import './config/authPassport/githubPassport.js';
///////////////////////////////////////
import session from "express-session";
/////////////////////////////////////////

////////////////////////////////////////////
import authRoutes from "./routes/auth.Route.js";
import aiRoutes from "./routes/chat.Route.js";
import ragRoutes from "./routes/ragChat.Route.js";

////////////////////////////////////////////////////////////////////
import googleAuthRoutes from './routes/3rdPartyAuth/googleAuth.Route.js';
import githubAuthRoutes from './routes/3rdPartyAuth/githubAuth.Route.js';




////////////////////////
import path from "path";
import { fileURLToPath } from 'url';

//////////////////
dotenv.config();
///////////
connectDB();


/////////////////////
const app = express();
const PORT = process.env.PORT || 3000;

//////////////////////////////////////////////////
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//////////////////////////
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
////////////////
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, 
  }
}));

///////////////////////////////
app.use(passport.initialize());
app.use(passport.session());

////////////////////////////////////////////////////////////////////
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/auth',googleAuthRoutes);
app.use('/auth',githubAuthRoutes);


//////////////////////////////
app.use("/api/auth", authRoutes);
app.use("/api/rag",ragRoutes);
app.use("/api/ai", aiRoutes);







///////////////////////////

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
