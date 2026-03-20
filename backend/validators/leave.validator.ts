import Joi from "joi";

//APPLY LEAVE
export const applyLeaveSchema = Joi.object({
  from_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "from_date must be YYYY-MM-DD",
      "any.required": "from_date is required",
    }),

  to_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "to_date must be YYYY-MM-DD",
    }),

  leave_type: Joi.string()
    .valid("FULL_DAY", "HALF_DAY")
    .required(),

  half_day_type: Joi.when("leave_type", {
    is: "HALF_DAY",
    then: Joi.string()
      .valid("FIRST_HALF", "SECOND_HALF")
      .required()
      .messages({
        "any.required": "half_day_type required for HALF_DAY leave",
      }),
    otherwise: Joi.optional(),
  }),

  reason: Joi.string()
    .min(5)
    .max(500)
    .required(),
});


//PARAM VALIDATION
export const leaveIdParamSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Leave ID must be a number",
  }),
});


//UPDATE LEAVE
export const updateLeaveStatusSchema = Joi.object({
  status: Joi.string()
    .valid("APPROVED", "REJECTED")
    .required()
    .messages({
      "any.only": "Status must be APPROVED or REJECTED",
    }),
});