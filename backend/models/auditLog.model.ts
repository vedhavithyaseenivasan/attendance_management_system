import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";

interface AuditLogAttributes {
  id: number;
  user_id?: number;
  action?: string;
  entity_type?: string;
  entity_id?: number;
  performed_by?: number;
  timestamp: Date;
}

interface AuditLogCreationAttributes
  extends Optional<AuditLogAttributes, "id" | "timestamp"> {}

class AuditLog
  extends Model<AuditLogAttributes, AuditLogCreationAttributes>
  implements AuditLogAttributes
{
  public id!: number;
  public user_id?: number;
  public action?: string;
  public entity_type?: string;
  public entity_id?: number;
  public performed_by?: number;
  public timestamp!: Date;
}

AuditLog.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    user_id: { type: DataTypes.INTEGER, allowNull: true },

    action: { type: DataTypes.STRING, allowNull: true },

    entity_type: { type: DataTypes.STRING, allowNull: true },

    entity_id: { type: DataTypes.INTEGER, allowNull: true },

    performed_by: { type: DataTypes.INTEGER, allowNull: true },

    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "audit_logs",
    modelName: "AuditLog",
    timestamps: false,
  }
);

export default AuditLog;