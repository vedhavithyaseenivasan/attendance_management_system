"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schemas) => async (req, res, next) => {
    try {
        //Validate body
        if (schemas.body) {
            const validatedBody = await schemas.body.validateAsync(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });
            req.validatedBody = validatedBody;
        }
        //Validate query
        if (schemas.query) {
            const validatedQuery = await schemas.query.validateAsync(req.query, {
                abortEarly: false,
                stripUnknown: true,
            });
            req.validatedQuery = validatedQuery;
        }
        //Validate params
        if (schemas.params) {
            const validatedParams = await schemas.params.validateAsync(req.params, {
                abortEarly: false,
                stripUnknown: true,
            });
            req.validatedParams = validatedParams;
        }
        next();
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message || "Validation error",
        });
    }
};
exports.validate = validate;
