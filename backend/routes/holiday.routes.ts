import { Router } from "express";
import auth from "../middleware/auth.middleware";
import role from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";

import {addHolidaySchema,getHolidayQuerySchema,} from "../validators/holiday.validator";

import {addHoliday,getHolidays,} from "../controllers/holiday.controller";

const router = Router();

//Add holiday
router.post(
  "/add",
  auth,
  role(["HR"]),
  validate({ body: addHolidaySchema }), 
  addHoliday
);

//Get holidays
router.get(
  "/",
  auth,
  validate({ query: getHolidayQuerySchema }), 
  getHolidays
);

export default router;