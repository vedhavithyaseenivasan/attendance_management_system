const { Attendance, User } = require("../models");
const { Op } = require("sequelize");
const { Roles, Status } = require("../constants/constants");
const { logAction } = require("./audit.service");

//Helper:"HH:MM" → "HH:MM:SS"
const formatTimeForDB = (timeStr) => {
  if (!timeStr) return null;
  return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
};

const markAttendance = async (
  user,
  { user_id, date, status, check_in_time, check_out_time }
) => {
  let targetUserId = user.id;

  //HR can mark attendance
  if (user.role === Roles.HR) {
    if (!user_id) {
      const error = new Error("User ID is required for HR");
      error.statusCode = 400;
      throw error;
    }
    targetUserId = user_id;
  }

  const targetUser = await User.findByPk(targetUserId);
  if (!targetUser || targetUser.status !== Status.ACTIVE) {
    const error = new Error("Target user not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  const attendanceDate =
    date || new Date().toISOString().split("T")[0];

  const checkIn = formatTimeForDB(check_in_time);
  const checkOut = formatTimeForDB(check_out_time);

  if (status === "PRESENT") {
    if (!checkIn || !checkOut) {
      const error = new Error(
        "Check-in and Check-out required for PRESENT status"
      );
      error.statusCode = 400;
      throw error;
    }
  }

  const existing = await Attendance.findOne({
    where: { user_id: targetUserId, date: attendanceDate },
  });

  if (existing) {
    existing.status = status || existing.status;
    existing.check_in_time =
      status === "PRESENT" ? checkIn : null;
    existing.check_out_time =
      status === "PRESENT" ? checkOut : null;
    existing.modified_by = user.id;
    existing.modified_at = new Date();

    await existing.save();
    return existing;
  }

  //Create new attendance
  const attendance = await Attendance.create({
    user_id: targetUserId,
    date: attendanceDate,
    status: status || "PRESENT",
    check_in_time:
      status === "PRESENT" ? checkIn : null,
    check_out_time:
      status === "PRESENT" ? checkOut : null,
    modified_by: null,
  });

  await logAction({
    userId: targetUserId,
    action: "CREATE",
    entityType: "Attendance",
    entityId: attendance.id,
    performedBy: user.id,
  });

  return attendance;
};

const getAttendance = async (user, month, year, selfOnly = false) => {
  let userIds = [];

  if (selfOnly) {
    userIds = [user.id];
  } else {
    if (user.role === Roles.TEAM_MEMBER) {
      userIds = [user.id];
    } else if (user.role === Roles.LEAD) {
      const members = await User.findAll({
        where: { reporting_to: user.id },
      });
      userIds = [user.id, ...members.map((u) => u.id)];
    } else if (user.role === Roles.MANAGER) {
      const leads = await User.findAll({
        where: { reporting_to: user.id, role: Roles.LEAD },
      });
      const leadIds = leads.map((l) => l.id);

      const teamMembers = await User.findAll({
        where: {
          reporting_to: { [Op.in]: leadIds },
          role: Roles.TEAM_MEMBER,
        },
      });

      userIds = [
        user.id,
        ...leadIds,
        ...teamMembers.map((tm) => tm.id),
      ];
    } else if (user.role === Roles.HR) {
      const allUsers = await User.findAll({
        attributes: ["id"],
      });
      userIds = allUsers.map((u) => u.id);
    }
  }

  const whereClause = { user_id: { [Op.in]: userIds } };

  if (month && year) {
    whereClause.date = {
      [Op.and]: [
        { [Op.gte]: new Date(year, month - 1, 1) },
        { [Op.lte]: new Date(year, month, 0) },
      ],
    };
  }

  const attendance = await Attendance.findAll({
    where: whereClause,
    include: {
      model: User,
      attributes: ["id", "name", "role"],
    },
    order: [["date", "DESC"]],
  });

  return attendance.map((a) => a.toJSON());
};

module.exports = { markAttendance, getAttendance };