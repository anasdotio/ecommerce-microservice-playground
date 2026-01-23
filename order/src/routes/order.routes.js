import { Router } from "express";

const router = Router();

import * as orderController from "../controller/order.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import { roleAuth } from "../middlewares/roleAuth.middleware.js";

router.post("/", authenticate, roleAuth("user"), orderController.createOrder);
router.get(
  "/",
  authenticate,
  roleAuth("user"),
  orderController.getOrdersByUser,
);

export default router;
