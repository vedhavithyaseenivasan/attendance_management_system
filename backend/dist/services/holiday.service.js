"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHolidays = exports.addHoliday = void 0;
const holiday_model_1 = __importDefault(require("../models/holiday.model"));
const sequelize_1 = require("sequelize");
//ADD HOLIDAY
const addHoliday = async (userId, holiday) => {
    return await holiday_model_1.default.create({
        ...holiday,
        created_by: userId,
    });
};
exports.addHoliday = addHoliday;
//GET HOLIDAYS
const getHolidays = async (month, year) => {
    const where = {};
    if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        where.date = {
            [sequelize_1.Op.between]: [
                startDate.toISOString().split("T")[0],
                endDate.toISOString().split("T")[0],
            ],
        };
    }
    return await holiday_model_1.default.findAll({
        where,
        order: [["date", "ASC"]],
    });
};
exports.getHolidays = getHolidays;
