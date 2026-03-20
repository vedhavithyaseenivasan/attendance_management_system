import { User } from "../models";
import bcrypt from "bcryptjs";
import { Roles, Status } from "../constants/constants";

interface CreateUserInput {
  employee_code: string;
  name: string;
  email: string;
  password: string;
  role: Roles;
  team_id?: number | null;
  reporting_to?: number | null;
  status?: Status;
}

interface UserType {
  employee_code: string;
  name: string;
  email: string;
  role: string;
  team_id?: number | null;
  status: string;
}

//Get All Users
export const getAllUsers = async (): Promise<UserType[]> => {
  const users = await User.findAll({
    attributes: [
      "id", 
      "employee_code",
      "name",
      "email",
      "role",
      "team_id",
      "status",
    ],
    order: [["created_at", "DESC"]],
  });

  return users.map((user: any) => user.toJSON());
};

//Create User
export const createUser = async (data: CreateUserInput) => {
  const {
    employee_code,
    name,
    email,
    password,
    role,
    team_id,
    reporting_to,
    status,
  } = data;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error("Email already exists") as Error & {
      statusCode?: number;
    };
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    employee_code,
    name,
    email,
    password_hash: hashedPassword,
    role,
    team_id: team_id || null,
    reporting_to: reporting_to || null,
    status: status || "ACTIVE",
  });

  return user.toJSON();
};