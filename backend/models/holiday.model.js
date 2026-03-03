const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Holiday = sequelize.define(
  "Holiday",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    date: { type: DataTypes.DATEONLY, allowNull: false },

    name: { type: DataTypes.STRING },

    type: {
      type: DataTypes.ENUM("GOVERNMENT", "WEEKEND"),
    },

    created_by: { type: DataTypes.INTEGER },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Holiday;