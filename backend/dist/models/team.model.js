"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Team extends sequelize_1.Model {
}
Team.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    team_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    manager_id: { type: sequelize_1.DataTypes.INTEGER },
}, {
    sequelize: db_1.default,
    tableName: "teams",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});
exports.default = Team;
