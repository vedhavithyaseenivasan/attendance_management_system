import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models";

interface LoginParams {
  email: string;
  password: string;
}

interface ChangePasswordParams {
  email: string;
  oldPassword: string;
  newPassword: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  team_id: number | null;
  reporting_to: number | null;
  status: string;
  employee_code: string;
}

interface LoginResponse {
  token: string;
  user: UserResponse;
}

//Validate JWT
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

//LOGIN
export const login = async ({ email, password }: LoginParams): Promise<LoginResponse> => {

  if (!email || !password) {
    const error = new Error("Email and password are required");
    (error as any).statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error("Invalid credentials");
    (error as any).statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    (error as any).statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      team_id: user.team_id,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      team_id: user.team_id ?? null,
      reporting_to: user.reporting_to ?? null,
      status:user.status ?? "ACTIVE",
      employee_code: user.employee_code,
    },
  };
};

//CHANGE PASSWORD
export const changePassword = async ({
  email,
  oldPassword,
  newPassword,
}: ChangePasswordParams): Promise<string> => {

  if (!email || !oldPassword || !newPassword) {
    const error = new Error("All fields are required");
    (error as any).statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error("User not found");
    (error as any).statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

  if (!isMatch) {
    const error = new Error("Old password incorrect");
    (error as any).statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password_hash = hashedPassword;

  await user.save();

  return "Password changed successfully";
};