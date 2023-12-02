import express from "express";
export const cartsRouter = express.Router();
import { cartsController } from "../controllers/carts.controller.js";
import { ticketsController } from "../controllers/tickets.controller.js";
import { checkCart, checkUser, checkLogin } from "../middlewares/main.js";

cartsRouter.get("/:cid", checkLogin, checkCart, cartsController.readByRender); /* renderizar el carro del usuario logueado */
cartsRouter.post("/:cid/products/:pid", checkCart, checkUser, cartsController.addProduct); /*agregar producto a carrito */
cartsRouter.put("/:cid/products/:pid", cartsController.updateProductQuantity); /*actualizar cantidad de producto */
cartsRouter.delete("/:cid/products/:pid", cartsController.deleteProduct); /*delete product */
cartsRouter.delete("/:cid", cartsController.emptyCart); /*clean cart */
cartsRouter.post("/:cid/purchase", checkCart, checkUser, ticketsController.create); /*finish buy */