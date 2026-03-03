const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Team = sequelize.define(
  "Team",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    team_name: { type: DataTypes.STRING, allowNull: false },

    manager_id: { type: DataTypes.INTEGER },

  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Team;