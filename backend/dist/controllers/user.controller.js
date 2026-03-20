"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const asyncHandler_1 = require("../middleware/asyncHandler");
//GET ALL USERS
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const users = await (0, user_service_1.getAllUsers)();
    res.status(200).json({
        success: true,
        data: users,
    });
});
//CREATE USER
exports.createUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, user_service_1.createUser)(req.body);
    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result,
    });
});
