const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const { markAttendance, getAttendance } = require("../controllers/attendance.controller");

//Mark attendance
router.post("/mark", authenticate, markAttendance);

//Get attendance
router.get("/", authenticate, getAttendance);

module.exports = router;