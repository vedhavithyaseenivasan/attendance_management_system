import sequelize from "../config/db";

import User from "./user.model";
import Team from "./team.model";
import Attendance from "./attendance.model";
import LeaveRequest from "./leaveRequest.model";
import Holiday from "./holiday.model";
import AuditLog from "./auditLog.model";

//Associations
User.belongsTo(Team, { foreignKey: 'team_id' });
Team.hasMany(User, { foreignKey: 'team_id' });

User.hasMany(Attendance, { foreignKey: 'user_id' });
Attendance.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(LeaveRequest, { foreignKey: 'user_id' });
LeaveRequest.belongsTo(User, { foreignKey: 'user_id' });

Holiday.belongsTo(User, { foreignKey: 'created_by' });
User.hasMany(Holiday, { foreignKey: 'created_by' });

//Self-referencing User
User.belongsTo(User, { as: 'Manager', foreignKey: 'reporting_to' });
User.hasMany(User, { as: 'TeamMembers', foreignKey: 'reporting_to' });

export {
    sequelize,
    User,
    Team,
    Attendance,
    LeaveRequest,
    Holiday,
    AuditLog,
};