import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://virtual-assistant-npca.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

// Start Server
const port = process.env.PORT || 5000;

app.listen(port, async () => {
  try {
    await connectDb();
    console.log(`Server started on port ${port}`);
  } catch (error) {
    console.log("Database connection failed:", error);
  }
});
