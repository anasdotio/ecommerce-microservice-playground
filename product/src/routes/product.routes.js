import { Router } from "express";
import * as productController from "../controller/product.controller.js";
import { authenticate } from "../middlwares/authenticate.middleware.js";
import { roleAuth } from "../middlwares/roleAuth.js";
const router = Router();

router.post(
  "/",
  authenticate,
  roleAuth("admin", "seller"),
  productController.createProduct,
);

router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);

export default router;
