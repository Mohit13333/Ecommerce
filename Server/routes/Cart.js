import express from "express";
import {
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  updateCart,
} from "../controllers/Cart.controller.js";

const router = express.Router();
router
  .post("/", addToCart)
  .get("/", fetchCartByUser)
  .delete("/:id", deleteFromCart)
  .patch("/:id", updateCart);
export { router };
