"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leave_controller_1 = require("../controllers/leave.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const role_middleware_1 = __importDefault(require("../middleware/role.middleware"));
const constants_1 = require("../constants/constants");
const validate_middleware_1 = require("../middleware/validate.middleware");
const leave_validator_1 = require("../validators/leave.validator");
const router = express_1.default.Router();
//Apply leave
router.post("/apply", auth_middleware_1.default, (0, validate_middleware_1.validate)({ body: leave_validator_1.applyLeaveSchema }), leave_controller_1.applyLeave);
//Delete leave
router.delete("/:id", auth_middleware_1.default, (0, validate_middleware_1.validate)({ params: leave_validator_1.leaveIdParamSchema }), leave_controller_1.deleteLeave);
//View own leaves
router.get("/my-leaves", auth_middleware_1.default, leave_controller_1.getMyLeaves);
//View team leaves
router.get("/team-leaves", auth_middleware_1.default, (0, role_middleware_1.default)([constants_1.Roles.LEAD, constants_1.Roles.MANAGER]), leave_controller_1.getTeamLeaves);
//Approve leave
router.put("/:id/status", auth_middleware_1.default, (0, role_middleware_1.default)([constants_1.Roles.LEAD, constants_1.Roles.MANAGER]), (0, validate_middleware_1.validate)({
    params: leave_validator_1.leaveIdParamSchema,
    body: leave_validator_1.updateLeaveStatusSchema,
}), leave_controller_1.updateLeaveStatus);
exports.default = router;
