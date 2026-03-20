import { Request, Response, NextFunction } from "express";
import Joi from "joi";

interface SchemaObject {
  body?: Joi.Schema;
  query?: Joi.Schema;
  params?: Joi.Schema;
}

export const validate =
  (schemas: SchemaObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //Validate body
      if (schemas.body) {
        const validatedBody = await schemas.body.validateAsync(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });
        (req as any).validatedBody = validatedBody;
      }

      //Validate query
      if (schemas.query) {
        const validatedQuery = await schemas.query.validateAsync(req.query, {
          abortEarly: false,
          stripUnknown: true,
        });
        (req as any).validatedQuery = validatedQuery;
      }

      //Validate params
      if (schemas.params) {
        const validatedParams = await schemas.params.validateAsync(req.params, {
          abortEarly: false,
          stripUnknown: true,
        });
        (req as any).validatedParams = validatedParams;
      }

      next();
    }
    catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || "Validation error",
      });
    }
  };