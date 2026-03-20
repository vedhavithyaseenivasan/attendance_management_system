"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendance = exports.updateAttendance = exports.markAttendance = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const constants_1 = require("../constants/constants");
const audit_service_1 = require("./audit.service");
//MARK ATTENDANCE
const markAttendance = async (user, params) => {
    const { user_id, date, status, check_in_time, check_out_time } = params;
    let targetUserId = user.id;
    if (user.role === constants_1.Roles.HR) {
        if (!user_id) {
            const error = new Error("User ID required for HR");
            error.statusCode = 400;
            throw error;
        }
        targetUserId = user_id;
    }
    const targetUser = await models_1.User.findByPk(targetUserId);
    if (!targetUser || targetUser.status !== constants_1.Status.ACTIVE) {
        const error = new Error("User not found or inactive");
        error.statusCode = 404;
        throw error;
    }
    const attendanceDate = date || new Date().toISOString().split("T")[0];
    const checkIn = check_in_time;
    const checkOut = check_out_time;
    if (status === "PRESENT" && (!checkIn || !checkOut)) {
        const error = new Error("Check-in and check-out required for PRESENT");
        error.statusCode = 400;
        throw error;
    }
    const existing = await models_1.Attendance.findOne({
        where: { user_id: targetUserId, date: attendanceDate },
    });
    if (existing) {
        existing.status = status || existing.status;
        existing.check_in_time = status === "PRESENT" ? checkIn : null;
        existing.check_out_time = status === "PRESENT" ? checkOut : null;
        existing.modified_by = user.id;
        existing.modified_at = new Date();
        await existing.save();
        return existing;
    }
    const attendance = await models_1.Attendance.create({
        user_id: targetUserId,
        date: attendanceDate,
        status: status || "PRESENT",
        check_in_time: status === "PRESENT" ? checkIn : null,
        check_out_time: status === "PRESENT" ? checkOut : null,
    });
    await (0, audit_service_1.logAction)({
        userId: targetUserId,
        action: "CREATE",
        entityType: "Attendance",
        entityId: attendance.id,
        performedBy: user.id,
    });
    return attendance;
};
exports.markAttendance = markAttendance;
//UPDATE ATTENDANCE
const updateAttendance = async (user, params) => {
    return (0, exports.markAttendance)(user, params);
};
exports.updateAttendance = updateAttendance;
//GET ATTENDANCE
const getAttendance = async (user, month, year, selfOnly = false) => {
    let userIds = [];
    if (selfOnly || user.role === constants_1.Roles.TEAM_MEMBER) {
        userIds = [user.id];
    }
    else if (user.role === constants_1.Roles.LEAD) {
        const members = await models_1.User.findAll({
            where: { reporting_to: user.id },
        });
        userIds = [user.id, ...members.map((u) => u.id)];
    }
    else if (user.role === constants_1.Roles.MANAGER) {
        const leads = await models_1.User.findAll({
            where: { reporting_to: user.id, role: constants_1.Roles.LEAD },
        });
        const leadIds = leads.map((l) => l.id);
        const members = await models_1.User.findAll({
            where: {
                reporting_to: { [sequelize_1.Op.in]: leadIds },
                role: constants_1.Roles.TEAM_MEMBER,
            },
        });
        userIds = [user.id, ...leadIds, ...members.map((m) => m.id)];
    }
    else if (user.role === constants_1.Roles.HR) {
        const users = await models_1.User.findAll({ attributes: ["id"] });
        userIds = users.map((u) => u.id);
    }
    const whereClause = {
        user_id: { [sequelize_1.Op.in]: userIds },
    };
    if (month && year) {
        whereClause.date = {
            [sequelize_1.Op.between]: [
                new Date(year, month - 1, 1),
                new Date(year, month, 0),
            ],
        };
    }
    const attendance = await models_1.Attendance.findAll({
        where: whereClause,
        include: {
            model: models_1.User,
            attributes: ["id", "name", "role"],
        },
        order: [["date", "DESC"]],
    });
    return attendance.map((a) => a.toJSON());
};
exports.getAttendance = getAttendance;
