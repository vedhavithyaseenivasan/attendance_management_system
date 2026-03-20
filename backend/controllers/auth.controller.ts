import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { asyncHandler } from "../middleware/asyncHandler";

//LOGIN
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

//CHANGE PASSWORD
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;

  const result = await authService.changePassword({email,oldPassword,newPassword,});

  res.status(200).json({
    success: true,
    message: result,
  });
});