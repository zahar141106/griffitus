import { Router } from "express";
import { register, login, requestRegister, confirmRegister } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/register/request", requestRegister);
router.post("/register/confirm", confirmRegister);
router.post("/login", login);

export default router;