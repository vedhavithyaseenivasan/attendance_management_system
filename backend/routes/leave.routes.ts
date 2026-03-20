import express from "express";
import {applyLeave,deleteLeave,getMyLeaves,getTeamLeaves,updateLeaveStatus} from "../controllers/leave.controller";

import authenticate from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";
import { Roles } from "../constants/constants";
import { validate } from "../middleware/validate.middleware";

import {applyLeaveSchema,leaveIdParamSchema,updateLeaveStatusSchema} from "../validators/leave.validator";

const router = express.Router();

//Apply leave
router.post(
  "/apply",
  authenticate,
  validate({ body: applyLeaveSchema }), 
  applyLeave
);

//Delete leave
router.delete(
  "/:id",
  authenticate,
  validate({ params: leaveIdParamSchema }),
  deleteLeave
);

//View own leaves
router.get("/my-leaves", authenticate, getMyLeaves);

//View team leaves
router.get(
  "/team-leaves",
  authenticate,
  roleMiddleware([Roles.LEAD, Roles.MANAGER]),
  getTeamLeaves
);

//Approve leave
router.put(
  "/:id/status",
  authenticate,
  roleMiddleware([Roles.LEAD, Roles.MANAGER]),
  validate({
    params: leaveIdParamSchema,    
    body: updateLeaveStatusSchema, 
  }),
  updateLeaveStatus
);

export default router;