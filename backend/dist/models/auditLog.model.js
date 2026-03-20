"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class AuditLog extends sequelize_1.Model {
}
AuditLog.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    action: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    entity_type: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    entity_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    performed_by: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    timestamp: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.default,
    tableName: "audit_logs",
    modelName: "AuditLog",
    timestamps: false,
});
exports.default = AuditLog;
