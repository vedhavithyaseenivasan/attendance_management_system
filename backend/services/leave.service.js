const { LeaveRequest, User } = require("../models");
const { Roles, Status, LeaveStatus } = require("../constants/constants");
const { logAction } = require("./audit.service");
const { Op } = require("sequelize");

//APPLY LEAVE
exports.applyLeave = async (user, body) => {
  const { from_date, to_date, leave_type, half_day_type, reason } = body;

  if (!from_date || !to_date || !leave_type || !reason) {
    const error = new Error("All fields are required");
    error.status = 400;
    throw error;
  }

  if (user.status !== Status.ACTIVE) {
    const error = new Error("User is inactive");
    error.status = 403;
    throw error;
  }

  if (new Date(from_date) > new Date(to_date)) {
    const error = new Error("Start date cannot be after end date");
    error.status = 400;
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

  return { message: "Leave applied successfully", leave };
};

//GET MY LEAVES
exports.getMyLeaves = async (user) => {
  return await LeaveRequest.findAll({
    where: { user_id: user.id },
    order: [["created_at", "DESC"]],
  });
};

//GET TEAM LEAVES
exports.getTeamLeaves = async (user) => {
  let userIds = [];

  if (user.role === Roles.LEAD) {
    const members = await User.findAll({ where: { reporting_to: user.id } });
    userIds = members.map(u => u.id);
  }
  else if (user.role === Roles.MANAGER) {
  
  const leads = await User.findAll({ where: { role: Roles.LEAD, reporting_to: user.id } });
  const leadIds = leads.map(u => u.id);

  const directTeamMembers = await User.findAll({ where: { reporting_to: user.id } });

  
  const membersUnderLeads = await User.findAll({ where: { reporting_to: { [Op.in]: leadIds } } });

  userIds = [
    ...directTeamMembers.map(u => u.id),
    ...leads.map(u => u.id),
    ...membersUnderLeads.map(u => u.id),
  ];
 }
 else if (user.role === Roles.HR) {
    const allUsers = await User.findAll({ attributes: ["id"] });
    userIds = allUsers.map(u => u.id);
  }
  else {
    const error = new Error("Access denied");
    error.status = 403;
    throw error;
  }

  return await LeaveRequest.findAll({
    where: { user_id: { [Op.in]: userIds } },
    include: { model: User, attributes: ["id", "name", "role", "reporting_to"] },
    order: [["created_at", "DESC"]],
  });
};

// UPDATE LEAVE STATUS
exports.updateLeaveStatus = async (user, leaveId, status) => {
  if (![Roles.LEAD, Roles.MANAGER].includes(user.role)) {
    const error = new Error("Only Lead or Manager can approve/reject leaves");
    error.status = 403;
    throw error;
  }

  if (!status || ![LeaveStatus.APPROVED, LeaveStatus.REJECTED].includes(status)) {
    const error = new Error("Status must be Approved or Rejected");
    error.status = 400;
    throw error;
  }

  const leave = await LeaveRequest.findByPk(leaveId, { include: { model: User } });
  if (!leave) {
    const error = new Error("Leave not found");
    error.status = 404;
    throw error;
  }

  const leaveUser = leave.User;

  // Hierarchy checks
  if (user.role === Roles.LEAD) {
    if (leaveUser.reporting_to !== user.id || leaveUser.role !== Roles.TEAM_MEMBER) {
      const error = new Error("Lead can approve only their team members' leaves");
      error.status = 403;
      throw error;
    }
  } else if (user.role === Roles.MANAGER) {
    const leads = await User.findAll({ where: { role: Roles.LEAD, reporting_to: user.id } });
    const leadIds = leads.map(l => l.id);

    const membersUnderLeads = await User.findAll({ where: { reporting_to: { [Op.in]: leadIds } } });
    const memberIdsUnderLeads = membersUnderLeads.map(m => m.id);

    const allowedUserIds = [
      ...memberIdsUnderLeads,
      ...leadIds,
      ...(await User.findAll({ where: { reporting_to: user.id } })).map(u => u.id),
    ];

    if (!allowedUserIds.includes(leaveUser.id)) {
      const error = new Error("Manager can approve only their leads or team members");
      error.status = 403;
      throw error;
    }
  }

  // Update leave status
  leave.status = status;
  leave.approved_by = user.id;
  leave.approved_at = new Date();
  await leave.save();

  //Auto mark attendance as ABSENT for approved leave
  if (status === LeaveStatus.APPROVED) {
    const { markAttendance } = require("./attendance.service"); // import here
    const startDate = new Date(leave.from_date);
    const endDate = new Date(leave.to_date);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      await markAttendance(leaveUser, {
        user_id: leaveUser.id,
        date: d.toISOString().split("T")[0],
        status: "ABSENT",
        check_in_time: null,
        check_out_time: null,
      });
    }
  }

  await logAction({
    userId: leaveUser.id,
    action: "UPDATE",
    entityType: "Leave_Request",
    entityId: leave.id,
    performedBy: user.id,
  });

  return { message: `Leave ${status} successfully`, leave };
};

// DELETE LEAVE
exports.deleteLeave = async (user, leaveId) => {
  const leave = await LeaveRequest.findByPk(leaveId);
  if (!leave) {
    const error = new Error("Leave not found");
    error.status = 404;
    throw error;
  }

  if (leave.user_id !== user.id) {
    const error = new Error("You can delete only your leave");
    error.status = 403;
    throw error;
  }

  if (leave.status !== LeaveStatus.APPLIED) {
    const error = new Error("Only applied leave can be deleted");
    error.status = 400;
    throw error;
  }

  await leave.destroy();

  await logAction({
    userId: user.id,
    action: "DELETE",
    entityType: "Leave_Request",
    entityId: leave.id,
    performedBy: user.id,
  });

  return { message: "Leave deleted successfully" };
};