"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../constants/constants");
exports.createUserSchema = joi_1.default.object({
    employee_code: joi_1.default.string().required(),
    name: joi_1.default.string().min(3).max(100).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    role: joi_1.default.string()
        .valid(...Object.values(constants_1.Roles))
        .required(),
    team_id: joi_1.default.number().allow(null).optional(),
    reporting_to: joi_1.default.number().allow(null).optional(),
    status: joi_1.default.string()
        .valid(...Object.values(constants_1.Status))
        .default(constants_1.Status.ACTIVE),
});
