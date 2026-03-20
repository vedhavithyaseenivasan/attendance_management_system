import { Router } from "express";
import auth from "../middleware/auth.middleware";
import role from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {getAllUsers,createUser} from "../controllers/user.controller";
import { createUserSchema } from "../validators/user.validator";

const router = Router();

//Get all users
router.get("/", auth, role(["HR"]), getAllUsers);

//Create user
router.post(
  "/create",
  auth,
  role(["HR"]),
  validate({ body: createUserSchema }),
  createUser
);

export default router;