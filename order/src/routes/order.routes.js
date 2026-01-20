import { Router } from "express";

const router = Router();

import * as orderController from "../controller/order.controller.js";

router.post("/", orderController.createOrder);

export default router;
