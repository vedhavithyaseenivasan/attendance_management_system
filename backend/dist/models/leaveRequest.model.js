"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class LeaveRequest extends sequelize_1.Model {
    constructor() {
        super(...arguments);
        this.status = 'APPLIED';
    }
}
LeaveRequest.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    from_date: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    to_date: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    leave_type: {
        type: sequelize_1.DataTypes.ENUM('FULL_DAY', 'HALF_DAY'),
        allowNull: false,
    },
    half_day_type: {
        type: sequelize_1.DataTypes.ENUM('FIRST_HALF', 'SECOND_HALF'),
        allowNull: true,
    },
    reason: { type: sequelize_1.DataTypes.STRING },
    status: {
        type: sequelize_1.DataTypes.ENUM('APPLIED', 'APPROVED', 'REJECTED'),
        defaultValue: "APPLIED",
    },
    approved_by: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    approved_at: { type: sequelize_1.DataTypes.DATE },
}, {
    sequelize: db_1.default,
    tableName: "leave_requests",
    modelName: "LeaveRequest",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});
exports.default = LeaveRequest;
