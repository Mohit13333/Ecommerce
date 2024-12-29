import express from "express";
import {
  createUser,
  loginUser,
  checkAuth,
  resetPasswordRequest,
  resetPassword,
  logout,
} from "../controllers/Auth.controller.js";
import { checkAuthentication } from "../middlewares/checkAuth.middlware.js";

const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", loginUser)
  .get("/check", checkAuthentication, checkAuth)
  .get("/logout", logout)
  .post("/reset-password-request", resetPasswordRequest)
  .post("/reset-password", resetPassword);

export { router };
