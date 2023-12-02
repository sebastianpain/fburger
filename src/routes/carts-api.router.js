import express from "express";
export const cartsApiRouter = express.Router();
import { cartsController } from "../controllers/carts.controller.js";

cartsApiRouter.post("/:cid/products/:pid", cartsController.addProduct); /*PRODUCT ADD */
cartsApiRouter.get("/", cartsController.read); /*READ CARTS*/
cartsApiRouter.get("/:cid", cartsController.readById); /* READ CART x id */
cartsApiRouter.put("/:cid", cartsController.updateCart); /* ACTUALIZAR cart */
cartsApiRouter.put("/:cid/products/:pid", cartsController.updateProductQuantity); /* ACTUALIZAR SOLO LA CANTIDAD DE UN PRODUCT  */
cartsApiRouter.delete("/:cid", cartsController.emptyCart); /* VACIAR CARRITO */
cartsApiRouter.delete("/:cid/products/:pid", cartsController.deleteProduct); /* ELIMINAR PRODUCTO DEL CARRITO */