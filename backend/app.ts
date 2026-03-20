import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import attendanceRoutes from "./routes/attendance.routes";
import leaveRoutes from "./routes/leave.routes";
import holidayRoutes from "./routes/holiday.routes";
import config from "./config";
import sequelize from "./config/db";

const app = express();
const PORT = config.port;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/holiday", holidayRoutes);
app.use(errorHandler);

//Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

      await sequelize.sync();
      console.log("Database synced");
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  catch (error) {
    console.error("Database connection failed:", error);
  }
};


export default startServer;