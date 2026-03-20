import express from "express";
import { login, changePassword } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import {
  loginSchema,
  changePasswordSchema,
} from "../validators/auth.validator";

const router = express.Router();

//login
router.post(
  "/login",
  validate({ body: loginSchema }),
  login
);

//change password
router.post(
  "/change-password",
  validate({ body: changePasswordSchema }),
  changePassword
);
export default router;