import { Attendance, User } from "../models";
import { Op } from "sequelize";
import { Roles, Status } from "../constants/constants";
import { logAction } from "./audit.service";

type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "HALF_DAY"
  | "LEAVE"
  | "HOLIDAY"
  | "WEEKEND";

interface MarkAttendanceParams {
  user_id?: number;
  date?: string;
  status?: AttendanceStatus;
  check_in_time?: string | null;
  check_out_time?: string | null;
}

interface ServiceUser {
  id: number;
  role: string;
}


//MARK ATTENDANCE
export const markAttendance = async (
  user: ServiceUser,
  params: MarkAttendanceParams
): Promise<Attendance> => {
  const { user_id, date, status, check_in_time, check_out_time } = params;

  let targetUserId = user.id;

  if (user.role === Roles.HR) {
    if (!user_id) {
      const error: any = new Error("User ID required for HR");
      error.statusCode = 400;
      throw error;
    }
    targetUserId = user_id;
  }

  const targetUser = await User.findByPk(targetUserId);

  if (!targetUser || targetUser.status !== Status.ACTIVE) {
    const error: any = new Error("User not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  const attendanceDate =
    date || new Date().toISOString().split("T")[0];

  const checkIn = check_in_time;
  const checkOut = check_out_time;

  if (status === "PRESENT" && (!checkIn || !checkOut)) {
    const error: any = new Error(
      "Check-in and check-out required for PRESENT"
    );
    error.statusCode = 400;
    throw error;
  }

  const existing = await Attendance.findOne({
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

  const attendance = await Attendance.create({
    user_id: targetUserId,
    date: attendanceDate,
    status: status || "PRESENT",
    check_in_time: status === "PRESENT" ? checkIn : null,
    check_out_time: status === "PRESENT" ? checkOut : null,
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


//UPDATE ATTENDANCE
export const updateAttendance = async (
  user: ServiceUser,
  params: MarkAttendanceParams
) => {
  return markAttendance(user, params);
};


//GET ATTENDANCE
export const getAttendance = async (
  user: ServiceUser,
  month?: number,
  year?: number,
  selfOnly = false
) => {
  let userIds: number[] = [];

  if (selfOnly || user.role === Roles.TEAM_MEMBER) {
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

    const members = await User.findAll({
      where: {
        reporting_to: { [Op.in]: leadIds },
        role: Roles.TEAM_MEMBER,
      },
    });

    userIds = [user.id, ...leadIds, ...members.map((m) => m.id)];
  } else if (user.role === Roles.HR) {
    const users = await User.findAll({ attributes: ["id"] });
    userIds = users.map((u) => u.id);
  }

  const whereClause: any = {
    user_id: { [Op.in]: userIds },
  };

  if (month && year) {
    whereClause.date = {
      [Op.between]: [
        new Date(year, month - 1, 1),
        new Date(year, month, 0),
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























