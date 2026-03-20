import Holiday from "../models/holiday.model";
import { Op } from "sequelize";

interface HolidayInput {
  date: string;
  name: string;
  type: "GOVERNMENT" | "WEEKEND";
}

//ADD HOLIDAY
export const addHoliday = async (
  userId: number,
  holiday: HolidayInput
) => {
  return await Holiday.create({
    ...holiday,
    created_by: userId,
  });
};

//GET HOLIDAYS
export const getHolidays = async (
  month?: number,
  year?: number
) => {
  const where: any = {};

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    where.date = {
      [Op.between]: [
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      ],
    };
  }

  return await Holiday.findAll({
    where,
    order: [["date", "ASC"]],
  });
};