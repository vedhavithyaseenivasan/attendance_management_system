import { Request, Response } from "express";
import * as holidayService from "../services/holiday.service";
import { asyncHandler } from "../middleware/asyncHandler";

interface HolidayInput {
  date: string;
  name: string;
  type: "GOVERNMENT" | "WEEKEND";
}

//ADD HOLIDAY
export const addHoliday = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    const error: any = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const holiday: HolidayInput = req.body;

  const createdHoliday = await holidayService.addHoliday(
    Number(req.user.id),
    holiday
  );

  res.status(201).json({
    success: true,
    message: "Holiday added successfully",
    data: createdHoliday,
  });
});

//GET HOLIDAYS
export const getHolidays = asyncHandler(async (req: Request, res: Response) => {
  const month = req.query.month ? Number(req.query.month) : undefined;
  const year = req.query.year ? Number(req.query.year) : undefined;

  const holidays = await holidayService.getHolidays(month, year);

  res.status(200).json({
    success: true,
    data: holidays,
  });
});