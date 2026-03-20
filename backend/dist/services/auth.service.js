"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
//Validate JWT
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
//LOGIN
const login = async ({ email, password }) => {
    if (!email || !password) {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        throw error;
    }
    const user = await models_1.User.findOne({ where: { email } });
    if (!user) {
        const error = new Error("Invalid credentials");
        error.statusCode = 401;
        throw error;
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!isMatch) {
        const error = new Error("Invalid credentials");
        error.statusCode = 401;
        throw error;
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        role: user.role,
        team_id: user.team_id,
    }, JWT_SECRET, { expiresIn: "1d" });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            team_id: user.team_id ?? null,
            reporting_to: user.reporting_to ?? null,
            status: user.status ?? "ACTIVE",
            employee_code: user.employee_code,
        },
    };
};
exports.login = login;
//CHANGE PASSWORD
const changePassword = async ({ email, oldPassword, newPassword, }) => {
    if (!email || !oldPassword || !newPassword) {
        const error = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
    }
    const user = await models_1.User.findOne({ where: { email } });
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    const isMatch = await bcryptjs_1.default.compare(oldPassword, user.password_hash);
    if (!isMatch) {
        const error = new Error("Old password incorrect");
        error.statusCode = 400;
        throw error;
    }
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
    user.password_hash = hashedPassword;
    await user.save();
    return "Password changed successfully";
};
exports.changePassword = changePassword;
