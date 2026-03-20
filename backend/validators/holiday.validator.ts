import Joi from "joi";

//ADD HOLIDAY
export const addHolidaySchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Date must be in YYYY-MM-DD format",
      "any.required": "Date is required",
    }),

  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.min": "Holiday name must be at least 3 characters",
      "any.required": "Holiday name is required",
    }),

  type: Joi.string()
    .valid("GOVERNMENT", "WEEKEND")
    .required()
    .messages({
      "any.only": "Type must be GOVERNMENT or WEEKEND",
    }),
});


//GET HOLIDAYS
export const getHolidayQuerySchema = Joi.object({
  month: Joi.number().min(1).max(12).optional(),
  year: Joi.number().min(2000).max(2100).optional(),
});