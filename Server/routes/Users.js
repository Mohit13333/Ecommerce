import express from "express";
import { fetchUserById, updateUser } from "../controllers/User.controller.js";

const router = express.Router();
router.get("/own", fetchUserById).patch("/:id", updateUser);

export { router };
