import { Request, Response } from "express";
import * as leaveService from "../services/leave.service";
import { asyncHandler } from "../middleware/asyncHandler";

//Helper to get userId from JWT
const getUserId = (req: Request): number => {
  if (!req.user) {
    const error: any = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
  return Number(req.user.id);
};

//APPLY LEAVE
export const applyLeave = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const result = await leaveService.applyLeave(userId, req.body);

  res.status(201).json({
    success: true,
    message: "Leave applied successfully",
    data: result,
  });
});

//GET MY LEAVES
export const getMyLeaves = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const leaves = await leaveService.getMyLeaves(userId);

  res.status(200).json({
    success: true,
    data: leaves,
  });
});

//GET TEAM LEAVES
export const getTeamLeaves = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const leaves = await leaveService.getTeamLeaves(userId);

  res.status(200).json({
    success: true,
    data: leaves,
  });
});

//UPDATE LEAVE STATUS
export const updateLeaveStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const leaveId = Number(req.params.id);

  const result = await leaveService.updateLeaveStatus(
    userId,
    leaveId,
    req.body.status
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

//DELETE LEAVE
export const deleteLeave = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const leaveId = Number(req.params.id);

  const result = await leaveService.deleteLeave(userId, leaveId);

  res.status(200).json({
    success: true,
    data: result,
  });
});