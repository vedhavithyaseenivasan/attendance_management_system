const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const { markAttendance, getAttendance, updateAttendance} = require("../controllers/attendance.controller");

//Mark attendance
router.post("/mark", authenticate, markAttendance);

//Get attendance
router.get("/", authenticate, getAttendance);

//Update attendance (HR)
router.post("/update", authenticate, updateAttendance);

module.exports = router;