import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import dotenv from "dotenv";
import { setRoutes } from "./routes/index.js";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 5000;

server.use(cookieParser());
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
    // origin: "https://click-shop-ecom.netlify.app",
    origin: "http://localhost:5174",
    credentials: true,
  })
);
server.use(express.json());
server.use(express.urlencoded({extended: true, limit: "16kb"}))
setRoutes(server);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
