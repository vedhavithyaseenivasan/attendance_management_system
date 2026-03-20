import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface HolidayAttributes {
  id: number;
  date: string;
  name?: string;
  type?: "GOVERNMENT" | "WEEKEND";
  created_by?: number;
}

interface HolidayCreationAttributes extends Optional<HolidayAttributes, "id"> {}

class Holiday
  extends Model<HolidayAttributes, HolidayCreationAttributes>
  implements HolidayAttributes
{
  public id!: number;
  public date!: string;
  public name?: string;
  public type?: "GOVERNMENT" | "WEEKEND";
  public created_by?: number;

  public readonly created_at!: Date;
}

Holiday.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    date: { type: DataTypes.DATEONLY, allowNull: false },

    name: { type: DataTypes.STRING, allowNull: true },

    type: {
      type: DataTypes.ENUM("GOVERNMENT", "WEEKEND"),
      allowNull: true,
    },

    created_by: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    tableName: "holidays",
    modelName: "Holiday",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Holiday;