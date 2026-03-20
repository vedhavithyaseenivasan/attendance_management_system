"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAttendanceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.markAttendanceSchema = joi_1.default.object({
    user_id: joi_1.default.number().optional(),
    date: joi_1.default.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
    status: joi_1.default.string()
        .valid("PRESENT", "ABSENT", "HALF_DAY", "LEAVE", "HOLIDAY", "WEEKEND")
        .required(),
    check_in_time: joi_1.default.when("status", {
        is: "PRESENT",
        then: joi_1.default.string().required(),
        otherwise: joi_1.default.allow(null, "").optional(),
    }),
    check_out_time: joi_1.default.when("status", {
        is: "PRESENT",
        then: joi_1.default.string().required(),
        otherwise: joi_1.default.allow(null, "").optional(),
    }),
});
