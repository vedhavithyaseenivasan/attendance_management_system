import { Request, Response } from "express";
import {
  getAllUsers as getAllUsersService,
  createUser as createUserService,
} from "../services/user.service";
import { asyncHandler } from "../middleware/asyncHandler";

//GET ALL USERS
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await getAllUsersService();

  res.status(200).json({
    success: true,
    data: users,
  });
});

//CREATE USER
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await createUserService(req.body);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: result,
  });
});