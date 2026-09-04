import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/user.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(
  {
    origin: "https://chat-gemini-m81n.onrender.com",
    credentials: true,
  }
));
app.use(express.json({ limit: '2mb' }));

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  connectDB();
});

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected with Database!")
  } catch(err) {
    console.log("Failed to connect with DB",err);
  }
}

