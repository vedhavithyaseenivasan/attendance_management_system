"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const router = express_1.default.Router();
//login
router.post("/login", (0, validate_middleware_1.validate)({ body: auth_validator_1.loginSchema }), auth_controller_1.login);
//change password
router.post("/change-password", (0, validate_middleware_1.validate)({ body: auth_validator_1.changePasswordSchema }), auth_controller_1.changePassword);
exports.default = router;
