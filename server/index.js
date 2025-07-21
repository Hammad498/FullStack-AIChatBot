import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.Route.js";

dotenv.config();

connectDB();



const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;