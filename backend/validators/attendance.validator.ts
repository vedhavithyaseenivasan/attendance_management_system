import Joi from "joi";

export const markAttendanceSchema = Joi.object({
  user_id: Joi.number().optional(),

  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),

  status: Joi.string()
    .valid("PRESENT", "ABSENT", "HALF_DAY", "LEAVE", "HOLIDAY", "WEEKEND")
    .required(),

  check_in_time: Joi.when("status", {
    is: "PRESENT",
    then: Joi.string().required(),
    otherwise: Joi.allow(null, "").optional(),
  }),

  check_out_time: Joi.when("status", {
    is: "PRESENT",
    then: Joi.string().required(),
    otherwise: Joi.allow(null, "").optional(),
  }),
});