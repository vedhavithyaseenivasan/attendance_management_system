"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = exports.Holiday = exports.LeaveRequest = exports.Attendance = exports.Team = exports.User = exports.sequelize = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.sequelize = db_1.default;
const user_model_1 = __importDefault(require("./user.model"));
exports.User = user_model_1.default;
const team_model_1 = __importDefault(require("./team.model"));
exports.Team = team_model_1.default;
const attendance_model_1 = __importDefault(require("./attendance.model"));
exports.Attendance = attendance_model_1.default;
const leaveRequest_model_1 = __importDefault(require("./leaveRequest.model"));
exports.LeaveRequest = leaveRequest_model_1.default;
const holiday_model_1 = __importDefault(require("./holiday.model"));
exports.Holiday = holiday_model_1.default;
const auditLog_model_1 = __importDefault(require("./auditLog.model"));
exports.AuditLog = auditLog_model_1.default;
//Associations
user_model_1.default.belongsTo(team_model_1.default, { foreignKey: 'team_id' });
team_model_1.default.hasMany(user_model_1.default, { foreignKey: 'team_id' });
user_model_1.default.hasMany(attendance_model_1.default, { foreignKey: 'user_id' });
attendance_model_1.default.belongsTo(user_model_1.default, { foreignKey: 'user_id' });
user_model_1.default.hasMany(leaveRequest_model_1.default, { foreignKey: 'user_id' });
leaveRequest_model_1.default.belongsTo(user_model_1.default, { foreignKey: 'user_id' });
holiday_model_1.default.belongsTo(user_model_1.default, { foreignKey: 'created_by' });
user_model_1.default.hasMany(holiday_model_1.default, { foreignKey: 'created_by' });
//Self-referencing User
user_model_1.default.belongsTo(user_model_1.default, { as: 'Manager', foreignKey: 'reporting_to' });
user_model_1.default.hasMany(user_model_1.default, { as: 'TeamMembers', foreignKey: 'reporting_to' });
