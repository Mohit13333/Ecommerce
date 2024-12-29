import express from "express";
import { fetchBrands, createBrand } from "../controllers/Brand.controller.js";

const router = express.Router();
router.get("/", fetchBrands).post("/", createBrand);

export { router };
