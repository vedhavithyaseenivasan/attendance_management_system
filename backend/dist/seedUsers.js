"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("./models");
async function seedUsers() {
    try {
        await models_1.sequelize.sync({ alter: true });
        console.log("Database synced");
        //Create Team
        const team = await models_1.Team.create({
            team_name: "Development Team",
        });
        const hashedPassword = await bcryptjs_1.default.hash("Password@123", 10);
        //Create Manager
        const manager = await models_1.User.create({
            employee_code: "EMP001",
            name: "Raj",
            email: "raj@company.com",
            password_hash: hashedPassword,
            role: "MANAGER",
            team_id: team.id,
            reporting_to: null,
            status: "ACTIVE",
        });
        //Create Lead
        const lead = await models_1.User.create({
            employee_code: "EMP002",
            name: "Priya",
            email: "priya@company.com",
            password_hash: hashedPassword,
            role: "LEAD",
            team_id: team.id,
            reporting_to: manager.id,
            status: "ACTIVE",
        });
        //Create Team Member
        await models_1.User.create({
            employee_code: "EMP003",
            name: "Arun",
            email: "arun@company.com",
            password_hash: hashedPassword,
            role: "TEAM_MEMBER",
            team_id: team.id,
            reporting_to: lead.id,
            status: "ACTIVE",
        });
        //Create HR
        await models_1.User.create({
            employee_code: "HR001",
            name: "Meena",
            email: "hr@company.com",
            password_hash: hashedPassword,
            role: "HR",
            team_id: null,
            reporting_to: null,
            status: "ACTIVE",
        });
        console.log("Users inserted successfully");
    }
    catch (error) {
        console.error("Seeding failed:", error);
    }
}
seedUsers();
