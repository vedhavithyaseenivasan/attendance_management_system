"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeaveStatusSchema = exports.leaveIdParamSchema = exports.applyLeaveSchema = void 0;
const joi_1 = __importDefault(require("joi"));
//APPLY LEAVE
exports.applyLeaveSchema = joi_1.default.object({
    from_date: joi_1.default.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
        "string.pattern.base": "from_date must be YYYY-MM-DD",
        "any.required": "from_date is required",
    }),
    to_date: joi_1.default.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
        "string.pattern.base": "to_date must be YYYY-MM-DD",
    }),
    leave_type: joi_1.default.string()
        .valid("FULL_DAY", "HALF_DAY")
        .required(),
    half_day_type: joi_1.default.when("leave_type", {
        is: "HALF_DAY",
        then: joi_1.default.string()
            .valid("FIRST_HALF", "SECOND_HALF")
            .required()
            .messages({
            "any.required": "half_day_type required for HALF_DAY leave",
        }),
        otherwise: joi_1.default.optional(),
    }),
    reason: joi_1.default.string()
        .min(5)
        .max(500)
        .required(),
});
//PARAM VALIDATION
exports.leaveIdParamSchema = joi_1.default.object({
    id: joi_1.default.number().required().messages({
        "number.base": "Leave ID must be a number",
    }),
});
//UPDATE LEAVE
exports.updateLeaveStatusSchema = joi_1.default.object({
    status: joi_1.default.string()
        .valid("APPROVED", "REJECTED")
        .required()
        .messages({
        "any.only": "Status must be APPROVED or REJECTED",
    }),
});
