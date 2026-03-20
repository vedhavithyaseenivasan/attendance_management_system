import Joi from "joi";
import { Roles, Status } from "../constants/constants";

export const createUserSchema = Joi.object({
  employee_code: Joi.string().required(),

  name: Joi.string().min(3).max(100).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  role: Joi.string()
  .valid(...Object.values(Roles))
  .required(),

  team_id: Joi.number().allow(null).optional(),

  reporting_to: Joi.number().allow(null).optional(),

  status: Joi.string()
  .valid(...Object.values(Status))
  .default(Status.ACTIVE),
});




