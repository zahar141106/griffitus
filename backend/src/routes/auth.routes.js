import { Router } from "express";
import { register, login, requestRegister, confirmRegister, loginConfirm, resendCode } from "../controllers/auth.controller.js";
import { requestPasswordReset, resetPassword } from "../controllers/auth.controller.js"

const router = Router();

router.post("/register", register);
router.post("/register/request", requestRegister);
router.post("/register/confirm", confirmRegister);
router.post("/login", login);
router.post("/login/confirm", loginConfirm);
router.post("/password/request", requestPasswordReset)
router.post("/password/reset", resetPassword)
router.post("/code/resend", resendCode);

export default router;