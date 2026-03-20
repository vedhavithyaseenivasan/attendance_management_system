"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const attendance_routes_1 = __importDefault(require("./routes/attendance.routes"));
const leave_routes_1 = __importDefault(require("./routes/leave.routes"));
const holiday_routes_1 = __importDefault(require("./routes/holiday.routes"));
const config_1 = __importDefault(require("./config"));
const db_1 = __importDefault(require("./config/db"));
const app = (0, express_1.default)();
const PORT = config_1.default.port;
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
//Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/attendance", attendance_routes_1.default);
app.use("/api/leave", leave_routes_1.default);
app.use("/api/holiday", holiday_routes_1.default);
app.use(errorHandler_1.errorHandler);
//Start server
const startServer = async () => {
    try {
        await db_1.default.authenticate();
        console.log("Database connected successfully");
        await db_1.default.sync();
        console.log("Database synced");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Database connection failed:", error);
    }
};
exports.default = startServer;
