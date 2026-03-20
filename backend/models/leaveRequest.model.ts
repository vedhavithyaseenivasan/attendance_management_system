import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface LeaveRequestAttributes {
  id: number;
  user_id: number;
  from_date: string; 
  to_date: string; 
  leave_type: 'FULL_DAY' | 'HALF_DAY';
  half_day_type?: 'FIRST_HALF' | 'SECOND_HALF' | null;
  reason?: string;
  status?: 'APPLIED' | 'APPROVED' | 'REJECTED';
  approved_by?: number | null;
  approved_at?: Date | null;
}

interface LeaveRequestCreationAttributes extends Optional<LeaveRequestAttributes, 'id' | 'status'> {}

class LeaveRequest extends Model<LeaveRequestAttributes, LeaveRequestCreationAttributes> implements LeaveRequestAttributes {
  public id!: number;
  public user_id!: number;
  public from_date!: string;
  public to_date!: string;
  public leave_type!: 'FULL_DAY' | 'HALF_DAY';
  public half_day_type?: 'FIRST_HALF' | 'SECOND_HALF' | null;
  public reason?: string;
  public status: 'APPLIED' | 'APPROVED' | 'REJECTED' = 'APPLIED';
  public approved_by?: number | null;
  public approved_at?: Date | null;

  public readonly created_at!: Date; // timestamps
}

LeaveRequest.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    from_date: { type: DataTypes.DATEONLY, allowNull: false },
    to_date: { type: DataTypes.DATEONLY, allowNull: false },
    leave_type: {
      type: DataTypes.ENUM('FULL_DAY', 'HALF_DAY'),
      allowNull: false,
    },
    half_day_type: {
      type: DataTypes.ENUM('FIRST_HALF', 'SECOND_HALF'),
      allowNull: true,
    },
    reason: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM('APPLIED', 'APPROVED', 'REJECTED'),
      defaultValue: "APPLIED",
    },
    approved_by: { type: DataTypes.INTEGER, allowNull: true },
    approved_at: { type: DataTypes.DATE },
  },
  {
    sequelize,
    tableName: "leave_requests",
    modelName: "LeaveRequest",
    timestamps: true,
    createdAt:'created_at',
    updatedAt:false,
  }
);

export default LeaveRequest;