 import express from "express";
import {
  Login,
  LogOut,
  signUp,
  verifyOTP,
  forgotPassword,
  verifyForgotOTP,
  resetPassword,
} from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", Login);
authRouter.post("/verify-otp", verifyOTP);
authRouter.get("/logout", LogOut);


authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-forgot-otp", verifyForgotOTP);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
