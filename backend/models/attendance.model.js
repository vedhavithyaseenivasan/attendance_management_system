const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    user_id: { type: DataTypes.INTEGER, allowNull: false },

    date: { type: DataTypes.DATEONLY, allowNull: false },

    status: {
      type: DataTypes.ENUM(
        "PRESENT",
        "ABSENT",
        "HALF_DAY",
        "LEAVE",
        "HOLIDAY",
        "WEEKEND"
      ),
      allowNull: false,
    },

    check_in_time: { type: DataTypes.TIME },

    check_out_time: { type: DataTypes.TIME },

    modified_by: { type: DataTypes.INTEGER, allowNull: true },

    modification_reason: { type: DataTypes.STRING },

    modified_at: { type: DataTypes.DATE },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,

    //Adding unique constraint
    indexes: [
      {
        unique: true,
        fields: ["user_id", "date"],
      },
    ],
  }
);

module.exports = Attendance;