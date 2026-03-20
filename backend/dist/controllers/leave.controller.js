"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLeave = exports.updateLeaveStatus = exports.getTeamLeaves = exports.getMyLeaves = exports.applyLeave = void 0;
const leaveService = __importStar(require("../services/leave.service"));
const asyncHandler_1 = require("../middleware/asyncHandler");
//Helper to get userId from JWT
const getUserId = (req) => {
    if (!req.user) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
    }
    return Number(req.user.id);
};
//APPLY LEAVE
exports.applyLeave = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    const result = await leaveService.applyLeave(userId, req.body);
    res.status(201).json({
        success: true,
        message: "Leave applied successfully",
        data: result,
    });
});
//GET MY LEAVES
exports.getMyLeaves = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    const leaves = await leaveService.getMyLeaves(userId);
    res.status(200).json({
        success: true,
        data: leaves,
    });
});
//GET TEAM LEAVES
exports.getTeamLeaves = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    const leaves = await leaveService.getTeamLeaves(userId);
    res.status(200).json({
        success: true,
        data: leaves,
    });
});
//UPDATE LEAVE STATUS
exports.updateLeaveStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    const leaveId = Number(req.params.id);
    const result = await leaveService.updateLeaveStatus(userId, leaveId, req.body.status);
    res.status(200).json({
        success: true,
        data: result,
    });
});
//DELETE LEAVE
exports.deleteLeave = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    const leaveId = Number(req.params.id);
    const result = await leaveService.deleteLeave(userId, leaveId);
    res.status(200).json({
        success: true,
        data: result,
    });
});
