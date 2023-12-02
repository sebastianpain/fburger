import express from "express";
export const productsApiRouter = express.Router();
import { productsController } from "../controllers/products.controller.js";
import { checkAdmin } from "../middlewares/main.js";

productsApiRouter.post("/", checkAdmin, productsController.create); /*Create new product*/
productsApiRouter.get("/paginate", productsController.readWithPagination); /*leer los productos con paginacion*/
productsApiRouter.get("/", productsController.read); /*leer todos los productos */
productsApiRouter.get("/:_id", productsController.readById); /*leer un producto por id*/
productsApiRouter.put("/:_id", checkAdmin, productsController.update); /*actualizar un producto por id  */
productsApiRouter.delete("/:_id", checkAdmin, productsController.delete); /*eliminar un producto por id*/