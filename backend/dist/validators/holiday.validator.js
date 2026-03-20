"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHolidayQuerySchema = exports.addHolidaySchema = void 0;
const joi_1 = __importDefault(require("joi"));
//ADD HOLIDAY
exports.addHolidaySchema = joi_1.default.object({
    date: joi_1.default.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
        "string.pattern.base": "Date must be in YYYY-MM-DD format",
        "any.required": "Date is required",
    }),
    name: joi_1.default.string()
        .min(3)
        .max(100)
        .required()
        .messages({
        "string.min": "Holiday name must be at least 3 characters",
        "any.required": "Holiday name is required",
    }),
    type: joi_1.default.string()
        .valid("GOVERNMENT", "WEEKEND")
        .required()
        .messages({
        "any.only": "Type must be GOVERNMENT or WEEKEND",
    }),
});
//GET HOLIDAYS
exports.getHolidayQuerySchema = joi_1.default.object({
    month: joi_1.default.number().min(1).max(12).optional(),
    year: joi_1.default.number().min(2000).max(2100).optional(),
});
