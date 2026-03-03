const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Status } = require("../constants/constants");

//LOGIN
exports.login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  //Create JWT token
  const token = jwt.sign(
    { id: user.id, role: user.role, team_id: user.team_id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      team_id: user.team_id,
      reporting_to: user.reporting_to,
      status: user.status,
      employee_code: user.employee_code,
    },
  };
};

//CHANGE PASSWORD
exports.changePassword = async ({ email, oldPassword, newPassword }) => {
  if (!email || !oldPassword || !newPassword) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isMatch) {
    const error = new Error("Old password incorrect");
    error.statusCode = 400;
    throw error;
  }

  const newHashed = await bcrypt.hash(newPassword, 10);
  user.password_hash = newHashed;
  await user.save();

  return "Password changed successfully";
};