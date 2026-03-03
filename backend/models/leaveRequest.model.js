const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LeaveRequest = sequelize.define(
  "LeaveRequest",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    user_id: { type: DataTypes.INTEGER, allowNull: false },

    from_date: { type: DataTypes.DATEONLY, allowNull: false },

    to_date: { type: DataTypes.DATEONLY, allowNull: false },

    leave_type: {
      type: DataTypes.ENUM("FULL_DAY", "HALF_DAY"),
      allowNull: false,
    },

    half_day_type: {
      type: DataTypes.ENUM("FIRST_HALF", "SECOND_HALF"),
      allowNull: true,
    },

    reason: { type: DataTypes.STRING },

    status: {
      type: DataTypes.ENUM("APPLIED", "APPROVED", "REJECTED"),
      defaultValue: "APPLIED",
    },

    approved_by: { type: DataTypes.INTEGER, allowNull: true },

    approved_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = LeaveRequest;