"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const role_middleware_1 = __importDefault(require("../middleware/role.middleware"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const user_controller_1 = require("../controllers/user.controller");
const user_validator_1 = require("../validators/user.validator");
const router = (0, express_1.Router)();
//Get all users
router.get("/", auth_middleware_1.default, (0, role_middleware_1.default)(["HR"]), user_controller_1.getAllUsers);
//Create user
router.post("/create", auth_middleware_1.default, (0, role_middleware_1.default)(["HR"]), (0, validate_middleware_1.validate)({ body: user_validator_1.createUserSchema }), user_controller_1.createUser);
exports.default = router;
