"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHolidays = exports.addHoliday = void 0;
const holidayService = __importStar(require("../services/holiday.service"));
const asyncHandler_1 = require("../middleware/asyncHandler");
//ADD HOLIDAY
exports.addHoliday = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
    }
    const holiday = req.body;
    const createdHoliday = await holidayService.addHoliday(Number(req.user.id), holiday);
    res.status(201).json({
        success: true,
        message: "Holiday added successfully",
        data: createdHoliday,
    });
});
//GET HOLIDAYS
exports.getHolidays = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const month = req.query.month ? Number(req.query.month) : undefined;
    const year = req.query.year ? Number(req.query.year) : undefined;
    const holidays = await holidayService.getHolidays(month, year);
    res.status(200).json({
        success: true,
        data: holidays,
    });
});
