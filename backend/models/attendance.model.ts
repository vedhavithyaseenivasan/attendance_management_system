import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface AttendanceAttributes {
  id: number;
  user_id: number;
  date: string;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE" | "HOLIDAY" | "WEEKEND";
  check_in_time?: string| null;
  check_out_time?: string| null;
  modified_by?: number;
  modification_reason?: string;
  modified_at?: Date;
}

interface AttendanceCreationAttributes extends Optional<AttendanceAttributes, "id"> {}

class Attendance
  extends Model<AttendanceAttributes, AttendanceCreationAttributes>
  implements AttendanceAttributes
{
  public id!: number;
  public user_id!: number;
  public date!: string;
  public status!: "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE" | "HOLIDAY" | "WEEKEND";
  public check_in_time?: string | null;
  public check_out_time?: string | null;  public modified_by?: number;
  public modification_reason?: string;
  public modified_at?: Date;

  public readonly created_at!: Date;
}

Attendance.init(
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

    check_in_time: { type: DataTypes.TIME, allowNull: true },

    check_out_time: { type: DataTypes.TIME, allowNull: true },

    modified_by: { type: DataTypes.INTEGER, allowNull: true },

    modification_reason: { type: DataTypes.STRING, allowNull: true },

    modified_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: "attendance",
    modelName: "Attendance",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,

    indexes: [
      {
        unique: true,
        fields: ["user_id", "date"],
      },
    ],
  }
);

export default Attendance;