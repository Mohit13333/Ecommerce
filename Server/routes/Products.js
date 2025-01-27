import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} from "../controllers/Product.controller.js";

const router = express.Router();
router
  .post("/", upload, createProduct)
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductById)
  .patch("/:id", upload, updateProduct);
export { router };
