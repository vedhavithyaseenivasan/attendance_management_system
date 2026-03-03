const bcrypt = require("bcryptjs");
const { sequelize, User, Team } = require("./models");

async function seedUsers() {
  try {
    await sequelize.sync({ alter: true });

    console.log("Database synced");

    //Create Team
    const team = await Team.create({
      team_name: "Development Team",
    });

    //Hash default password
    const hashedPassword = await bcrypt.hash("Password@123", 10);

    //Create Manager
    const manager = await User.create({
      employee_code: "EMP001",
      name: "Raj",
      email: "raj@company.com",
      password_hash: hashedPassword,//Password@123
      role: "MANAGER",
      team_id: team.id,
      reporting_to: null,
      status: "ACTIVE",
    });

    //Create Lead
    const lead = await User.create({
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
    await User.create({
      employee_code: "EMP003",
      name: "Arun",
      email: "arun@company.com",
      password_hash: hashedPassword, // Password123
      role: "TEAM_MEMBER",
      team_id: team.id,
      reporting_to: lead.id,
      status: "ACTIVE",
    });

    //Create HR (no team)
    await User.create({
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
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

seedUsers();