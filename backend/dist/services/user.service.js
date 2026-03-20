"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getAllUsers = void 0;
const models_1 = require("../models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//Get All Users
const getAllUsers = async () => {
    const users = await models_1.User.findAll({
        attributes: [
            "id",
            "employee_code",
            "name",
            "email",
            "role",
            "team_id",
            "status",
        ],
        order: [["created_at", "DESC"]],
    });
    return users.map((user) => user.toJSON());
};
exports.getAllUsers = getAllUsers;
//Create User
const createUser = async (data) => {
    const { employee_code, name, email, password, role, team_id, reporting_to, status, } = data;
    const existingUser = await models_1.User.findOne({ where: { email } });
    if (existingUser) {
        const error = new Error("Email already exists");
        error.statusCode = 400;
        throw error;
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await models_1.User.create({
        employee_code,
        name,
        email,
        password_hash: hashedPassword,
        role,
        team_id: team_id || null,
        reporting_to: reporting_to || null,
        status: status || "ACTIVE",
    });
    return user.toJSON();
};
exports.createUser = createUser;
