"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
//LOGIN 
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string()
        .min(6)
        .required()
        .messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
});
//CHANGE PASSWORD
exports.changePasswordSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required(),
    oldPassword: joi_1.default.string()
        .required()
        .messages({
        "any.required": "Old password is required",
    }),
    newPassword: joi_1.default.string()
        .min(6)
        .required()
        .messages({
        "string.min": "New password must be at least 6 characters",
    }),
});
