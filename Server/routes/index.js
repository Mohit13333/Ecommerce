import { router as productsRouter } from "./Products.js";
import { router as categoriesRouter } from "./Categories.js";
import { router as brandsRouter } from "./Brands.js";
import { router as usersRouter } from "./Users.js";
import { router as authRouter } from "./Auth.js";
import { router as cartRouter } from "./Cart.js";
import { router as ordersRouter } from "./Order.js";
import {router as webhookRouter} from "./webhook.js"
import {router as paymentRouter} from "./payment.js"
import { checkAuthentication } from "../middlewares/checkAuth.middlware.js";

export const setRoutes = (server) => {
  server.use("/products", checkAuthentication, productsRouter);
  server.use("/categories", checkAuthentication, categoriesRouter);
  server.use("/brands", checkAuthentication, brandsRouter);
  server.use("/users", checkAuthentication, usersRouter);
  server.use("/auth", authRouter);
  server.use("/cart", checkAuthentication, cartRouter);
  server.use("/orders", checkAuthentication, ordersRouter);
  server.use("/", checkAuthentication, webhookRouter);
  server.use("/", checkAuthentication, paymentRouter);
};
