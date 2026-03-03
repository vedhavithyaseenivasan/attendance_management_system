const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    employee_code: { type: DataTypes.STRING, unique: true, allowNull: false },

    name: { type: DataTypes.STRING, allowNull: false },

    email: { type: DataTypes.STRING, unique: true, allowNull: false },

    password_hash: { type: DataTypes.STRING, allowNull: false },

    role: {
      type: DataTypes.ENUM("TEAM_MEMBER", "LEAD", "MANAGER", "HR"),
      allowNull: false,
    },

    team_id: { type: DataTypes.INTEGER, allowNull: true },

    reporting_to: { type: DataTypes.INTEGER, allowNull: true },

    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = User;