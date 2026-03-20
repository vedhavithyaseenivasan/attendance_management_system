import { Router } from "express";
import authenticate from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { markAttendanceSchema } from "../validators/attendance.validator";

import {
  markAttendance,
  getAttendance,
  updateAttendance,
} from "../controllers/attendance.controller";

const router = Router();

//Mark attendance
router.post(
  "/mark",
  authenticate,
  validate({ body: markAttendanceSchema }), 
  markAttendance
);

//Get attendance
router.get("/", authenticate, getAttendance);

//Update attendance
router.put(
  "/update",
  authenticate,
  validate({ body: markAttendanceSchema }), 
  updateAttendance
);

export default router;