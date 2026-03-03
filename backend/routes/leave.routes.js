const express = require("express");
const router = express.Router();

const leaveController = require("../controllers/leave.controller");
const authenticate = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const { Roles } = require("../constants/constants");

//Apply leave
router.post("/apply", authenticate, leaveController.applyLeave);

//View own leaves
router.get("/my-leaves", authenticate, leaveController.getMyLeaves);

//Team leaves
router.get(
  "/team-leaves",
  authenticate,
  roleMiddleware([Roles.LEAD, Roles.MANAGER]),
  leaveController.getTeamLeaves
);

//Approve leaves
router.put(
  "/:id/status",
  authenticate,
  roleMiddleware([Roles.LEAD, Roles.MANAGER]),
  leaveController.updateLeaveStatus
);

module.exports = router;