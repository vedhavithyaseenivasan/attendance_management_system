import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface UserAttributes {
  id: number;
  employee_code: string;
  name: string;
  email: string;
  password_hash: string;
  role: "TEAM_MEMBER" | "LEAD" | "MANAGER" | "HR";
  team_id: number | null;
  reporting_to: number | null;
  status: "ACTIVE" | "INACTIVE";
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "team_id" | "reporting_to" | "status"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes
{
  public id!: number;
  public employee_code!: string;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public role!: "TEAM_MEMBER" | "LEAD" | "MANAGER" | "HR";

  public team_id!: number | null;
  public reporting_to!: number | null;

  public status!: "ACTIVE" | "INACTIVE";

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    employee_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("TEAM_MEMBER", "LEAD", "MANAGER", "HR"),
      allowNull: false,
    },

    team_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    reporting_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    indexes: [
      { unique: true, fields: ["email"] },
      { unique: true, fields: ["employee_code"] },
    ],
  }
);

export default User;