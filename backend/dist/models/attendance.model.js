"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Attendance extends sequelize_1.Model {
}
Attendance.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    date: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM("PRESENT", "ABSENT", "HALF_DAY", "LEAVE", "HOLIDAY", "WEEKEND"),
        allowNull: false,
    },
    check_in_time: { type: sequelize_1.DataTypes.TIME, allowNull: true },
    check_out_time: { type: sequelize_1.DataTypes.TIME, allowNull: true },
    modified_by: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    modification_reason: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    modified_at: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, {
    sequelize: db_1.default,
    tableName: "attendance",
    modelName: "Attendance",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
        {
            unique: true,
            fields: ["user_id", "date"],
        },
    ],
});
exports.default = Attendance;
