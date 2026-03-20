import { LeaveRequest, User } from "../models";
import { Op } from "sequelize";
import { logAction } from "./audit.service";
import { Roles,LeaveStatus } from "../constants/constants";

interface LeaveBody {
  from_date: string;
  to_date: string;
  leave_type: "FULL_DAY" | "HALF_DAY";
  half_day_type?: "FIRST_HALF" | "SECOND_HALF";
  reason: string;
}


//APPLY LEAVE
export const applyLeave = async (userId: number, body: LeaveBody) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const { from_date, to_date, leave_type, half_day_type, reason } = body;

  if (!from_date || !to_date || !leave_type || !reason) {
    const error: any = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  if (user.status !== "ACTIVE") {
    const error: any = new Error("User is inactive");
    error.statusCode = 403;
    throw error;
  }

  if (new Date(from_date) > new Date(to_date)) {
    const error: any = new Error("Start date cannot be after end date");
    error.statusCode = 400;
    throw error;
  }

  const leave = await LeaveRequest.create({
    user_id: user.id,
    from_date,
    to_date,
    leave_type,
    half_day_type: leave_type === "HALF_DAY" ? half_day_type : null,
    reason,
    status: LeaveStatus.APPLIED,
  });

  await logAction({
    userId: user.id,
    action: "CREATE",
    entityType: "Leave_Request",
    entityId: leave.id,
    performedBy: user.id,
  });

  return leave;
};

//GET MY LEAVES
export const getMyLeaves = async (userId: number) => {
  return LeaveRequest.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
  });
};

//GET TEAM LEAVES
export const getTeamLeaves = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  let userIds: number[] = [];

  if (user.role === Roles.LEAD) {
    const members = await User.findAll({
      where: { reporting_to: user.id },
      attributes: ["id"],
    });

    userIds = members.map((m) => m.id);
  }

  else if (user.role === Roles.MANAGER) {
    const leads = await User.findAll({
      where: { role: Roles.LEAD, reporting_to: user.id },
      attributes: ["id"],
    });

    const leadIds = leads.map((l) => l.id);

    const members = await User.findAll({
      where: { reporting_to: { [Op.in]: leadIds } },
      attributes: ["id"],
    });

    userIds = [...leadIds, ...members.map((m) => m.id)];
  }

  else if (user.role === Roles.HR) {
    const users = await User.findAll({ attributes: ["id"] });
    userIds = users.map((u) => u.id);
  }

  else {
    const error: any = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  return LeaveRequest.findAll({
    where: { user_id: { [Op.in]: userIds } },
    include: {
      model: User,
      attributes: ["id", "name", "role", "reporting_to"],
    },
    order: [["created_at", "DESC"]],
  });
};

//UPDATE LEAVE
export const updateLeaveStatus = async (
  userId: number,
  leaveId: number,
  status: LeaveStatus
) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (![Roles.LEAD, Roles.MANAGER].includes(user.role as Roles)) {
    const error: any = new Error("Only Lead or Manager can approve/reject leaves");
    error.statusCode = 403;
    throw error;
  }

  if (![LeaveStatus.APPROVED, LeaveStatus.REJECTED].includes(status)) {
    const error: any = new Error("Invalid leave status");
    error.statusCode = 400;
    throw error;
  }

  const leave = await LeaveRequest.findByPk(leaveId, {
    include: { model: User },
  });

  if (!leave) {
    const error: any = new Error("Leave not found");
    error.statusCode = 404;
    throw error;
  }

  await leave.update({
    status: status,
    approved_by: user.id,
    approved_at: new Date(),
  });

  await logAction({
    userId:leave.user_id,
    action: "UPDATE",
    entityType: "Leave_Request",
    entityId: leave.id,
    performedBy: user.id,
  });

  return leave;
};

//DELETE LEAVE
export const deleteLeave = async (userId: number, leaveId: number) => {
  const leave = await LeaveRequest.findByPk(leaveId);

  if (!leave) {
    const error: any = new Error("Leave not found");
    error.statusCode = 404;
    throw error;
  }

  if (leave.user_id !== userId) {
    const error: any = new Error("You can delete only your leave");
    error.statusCode = 403;
    throw error;
  }

  if (leave.status !== LeaveStatus.APPLIED) {
    const error: any = new Error("Only applied leave can be deleted");
    error.statusCode = 400;
    throw error;
  }

  await leave.destroy();

  await logAction({
    userId: userId,
    action: "DELETE",
    entityType: "Leave_Request",
    entityId: leave.id,
    performedBy: userId,
  });

  return { message: "Leave deleted successfully" };
};