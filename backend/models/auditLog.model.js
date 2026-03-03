const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AuditLog = sequelize.define("AuditLog", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  user_id: { type: DataTypes.INTEGER },

  action: { type: DataTypes.STRING },

  entity_type: { type: DataTypes.STRING },

  entity_id: { type: DataTypes.INTEGER },

  performed_by: { type: DataTypes.INTEGER },

  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = AuditLog;