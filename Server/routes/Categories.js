import express from "express";
import {
  fetchCategories,
  createCategory,
} from "../controllers/Category.controller.js";

const router = express.Router();
router.get("/", fetchCategories).post("/", createCategory);

export { router };
