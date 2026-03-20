import { Request, Response } from "express";
import * as attendanceService from "../services/attendance.service";
import { asyncHandler } from "../middleware/asyncHandler";

interface ServiceUser {
  id: number;
  role: string;
}

//Convert JWT user to service user
const getServiceUser = (req: Request): ServiceUser => {
  if (!req.user) {
    const error: any = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  return {
    id: Number(req.user.id),
    role: req.user.role,
  };
};

//MARK ATTENDANCE
export const markAttendance = asyncHandler(async (req: Request, res: Response) => {
  const user = getServiceUser(req);

  const result = await attendanceService.markAttendance(user, req.body);

  res.status(201).json({
    success: true,
    message: "Attendance marked successfully",
    data: result,
  });
});

//GET ATTENDANCE
export const getAttendance = asyncHandler(async (req: Request, res: Response) => {
  const user = getServiceUser(req);

  const month = req.query.month ? Number(req.query.month) : undefined;
  const year = req.query.year ? Number(req.query.year) : undefined;
  const selfOnly = req.query.self === "true";

  const result = await attendanceService.getAttendance(
    user,
    month,
    year,
    selfOnly
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

//UPDATE ATTENDANCE
export const updateAttendance = asyncHandler(async (req: Request, res: Response) => {
  const user = getServiceUser(req);

  if (user.role !== "HR") {
    const error: any = new Error("Only HR can update attendance");
    error.statusCode = 403;
    throw error;
  }

  const result = await attendanceService.updateAttendance(user, req.body);

  res.status(200).json({
    success: true,
    message: "Attendance updated successfully",
    data: result,
  });
});