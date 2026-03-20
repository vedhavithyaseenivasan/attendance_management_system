"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const attendance_validator_1 = require("../validators/attendance.validator");
const attendance_controller_1 = require("../controllers/attendance.controller");
const router = (0, express_1.Router)();
//Mark attendance
router.post("/mark", auth_middleware_1.default, (0, validate_middleware_1.validate)({ body: attendance_validator_1.markAttendanceSchema }), attendance_controller_1.markAttendance);
//Get attendance
router.get("/", auth_middleware_1.default, attendance_controller_1.getAttendance);
//Update attendance
router.put("/update", auth_middleware_1.default, (0, validate_middleware_1.validate)({ body: attendance_validator_1.markAttendanceSchema }), attendance_controller_1.updateAttendance);
exports.default = router;
