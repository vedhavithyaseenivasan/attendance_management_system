"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLeave = exports.updateLeaveStatus = exports.getTeamLeaves = exports.getMyLeaves = exports.applyLeave = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const audit_service_1 = require("./audit.service");
const constants_1 = require("../constants/constants");
const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};
//APPLY LEAVE
const applyLeave = async (userId, body) => {
    const user = await models_1.User.findByPk(userId);
    if (!user)
        throw createError("User not found", 404);
    const { from_date, to_date, leave_type, half_day_type, reason } = body;
    if (!from_date || !to_date || !leave_type || !reason) {
        throw createError("All fields are required", 400);
    }
    if (user.status !== "ACTIVE") {
        throw createError("User is inactive", 403);
    }
    if (new Date(from_date) > new Date(to_date)) {
        throw createError("Start date cannot be after end date", 400);
    }
    const leave = await models_1.LeaveRequest.create({
        user_id: user.id,
        from_date,
        to_date,
        leave_type,
        half_day_type: leave_type === "HALF_DAY" ? half_day_type : null,
        reason,
        status: constants_1.LeaveStatus.APPLIED,
    });
    await (0, audit_service_1.logAction)({
        userId: user.id,
        action: "CREATE",
        entityType: "Leave_Request",
        entityId: leave.id,
        performedBy: user.id,
    });
    return leave;
};
exports.applyLeave = applyLeave;
//GET MY LEAVES
const getMyLeaves = async (userId) => {
    return models_1.LeaveRequest.findAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]],
    });
};
exports.getMyLeaves = getMyLeaves;
//GET TEAM LEAVES
const getTeamLeaves = async (userId) => {
    const user = await models_1.User.findByPk(userId);
    if (!user)
        throw createError("User not found", 404);
    let userIds = [];
    if (user.role === constants_1.Roles.LEAD) {
        const members = await models_1.User.findAll({
            where: { reporting_to: user.id },
            attributes: ["id"],
        });
        userIds = members.map((m) => m.id);
    }
    else if (user.role === constants_1.Roles.MANAGER) {
        const leads = await models_1.User.findAll({
            where: { role: constants_1.Roles.LEAD, reporting_to: user.id },
            attributes: ["id"],
        });
        const leadIds = leads.map((l) => l.id);
        const members = await models_1.User.findAll({
            where: { reporting_to: { [sequelize_1.Op.in]: leadIds } },
            attributes: ["id"],
        });
        userIds = [...leadIds, ...members.map((m) => m.id)];
    }
    else if (user.role === constants_1.Roles.HR) {
        const users = await models_1.User.findAll({ attributes: ["id"] });
        userIds = users.map((u) => u.id);
    }
    else {
        throw createError("Access denied", 403);
    }
    return models_1.LeaveRequest.findAll({
        where: { user_id: { [sequelize_1.Op.in]: userIds } },
        include: {
            model: models_1.User,
            attributes: ["id", "name", "role", "reporting_to"],
        },
        order: [["created_at", "DESC"]],
    });
};
exports.getTeamLeaves = getTeamLeaves;
//UPDATE LEAVE
const updateLeaveStatus = async (userId, leaveId, status) => {
    const user = await models_1.User.findByPk(userId);
    if (!user)
        throw createError("User not found", 404);
    if (![constants_1.Roles.LEAD, constants_1.Roles.MANAGER].includes(user.role)) {
        throw createError("Only Lead or Manager can approve/reject leaves", 403);
    }
    if (![constants_1.LeaveStatus.APPROVED, constants_1.LeaveStatus.REJECTED].includes(status)) {
        throw createError("Invalid leave status", 400);
    }
    const leave = await models_1.LeaveRequest.findByPk(leaveId, {
        include: { model: models_1.User },
    });
    if (!leave)
        throw createError("Leave not found", 404);
    await leave.update({
        status: status,
        approved_by: user.id,
        approved_at: new Date(),
    });
    await (0, audit_service_1.logAction)({
        userId: leave.user_id,
        action: "UPDATE",
        entityType: "Leave_Request",
        entityId: leave.id,
        performedBy: user.id,
    });
    return leave;
};
exports.updateLeaveStatus = updateLeaveStatus;
//DELETE LEAVE
const deleteLeave = async (userId, leaveId) => {
    const leave = await models_1.LeaveRequest.findByPk(leaveId);
    if (!leave)
        throw createError("Leave not found", 404);
    if (leave.user_id !== userId) {
        throw createError("You can delete only your leave", 403);
    }
    if (leave.status !== constants_1.LeaveStatus.APPLIED) {
        throw createError("Only applied leave can be deleted", 400);
    }
    await leave.destroy();
    await (0, audit_service_1.logAction)({
        userId: userId,
        action: "DELETE",
        entityType: "Leave_Request",
        entityId: leave.id,
        performedBy: userId,
    });
    return { message: "Leave deleted successfully" };
};
exports.deleteLeave = deleteLeave;
