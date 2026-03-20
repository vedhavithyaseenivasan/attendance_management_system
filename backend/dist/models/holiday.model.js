"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Holiday extends sequelize_1.Model {
}
Holiday.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    type: {
        type: sequelize_1.DataTypes.ENUM("GOVERNMENT", "WEEKEND"),
        allowNull: true,
    },
    created_by: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
}, {
    sequelize: db_1.default,
    tableName: "holidays",
    modelName: "Holiday",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});
exports.default = Holiday;
