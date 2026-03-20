"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const role_middleware_1 = __importDefault(require("../middleware/role.middleware"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const holiday_validator_1 = require("../validators/holiday.validator");
const holiday_controller_1 = require("../controllers/holiday.controller");
const router = (0, express_1.Router)();
//Add holiday
router.post("/add", auth_middleware_1.default, (0, role_middleware_1.default)(["HR"]), (0, validate_middleware_1.validate)({ body: holiday_validator_1.addHolidaySchema }), holiday_controller_1.addHoliday);
//Get holidays
router.get("/", auth_middleware_1.default, (0, validate_middleware_1.validate)({ query: holiday_validator_1.getHolidayQuerySchema }), holiday_controller_1.getHolidays);
exports.default = router;
