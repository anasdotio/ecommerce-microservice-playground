import { Router } from "express";
import * as userController from "../controller/user.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";
const router = Router();

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/me", authenticate, userController.me);

export default router;
