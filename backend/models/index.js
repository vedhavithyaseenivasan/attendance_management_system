const sequelize = require("../config/db");

const User = require("./user.model");
const Team = require("./team.model");
const Attendance = require("./attendance.model");
const LeaveRequest = require("./leaveRequest.model");
const Holiday = require("./holiday.model");
const AuditLog = require("./auditLog.model");

//Associations
User.belongsTo(Team, { foreignKey: "team_id" });
Team.hasMany(User, { foreignKey: "team_id" });

User.hasMany(Attendance, { foreignKey: "user_id" });
Attendance.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(LeaveRequest, { foreignKey: "user_id" });
LeaveRequest.belongsTo(User, { foreignKey: "user_id" });

Holiday.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(Holiday, { foreignKey: "created_by" });

//Self-referencing User
User.belongsTo(User, { as: "Manager", foreignKey: "reporting_to" });
User.hasMany(User, { as: "TeamMembers", foreignKey: "reporting_to" });


module.exports = {
  
    sequelize,
  User,
  Team,
  Attendance,
  LeaveRequest,
  Holiday,
  AuditLog,
};