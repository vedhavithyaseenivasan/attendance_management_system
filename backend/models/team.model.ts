import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface TeamAttributes {
  id?: number;
  team_name: string;
  manager_id?: number;
}

interface TeamCreationAttributes extends Optional<TeamAttributes, 'id'> {}

class Team extends Model<TeamAttributes, TeamCreationAttributes> implements TeamAttributes {
  public id!: number;
  public team_name!: string;
  public manager_id?: number;

  public readonly created_at!: Date;
  public readonly updatedAt!: Date | null;
}

Team.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    team_name: { type: DataTypes.STRING, allowNull: false },
    manager_id: { type: DataTypes.INTEGER },
  },
  {
    sequelize,
    tableName: "teams",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Team;