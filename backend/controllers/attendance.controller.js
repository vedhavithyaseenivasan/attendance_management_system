const attendanceService = require("../services/attendance.service");

//Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const {
      user_id,
      date,
      status,
      check_in_time,
      check_out_time,
    } = req.body;

    const result = await attendanceService.markAttendance(req.user, {
      user_id,
      date,
      status,
      check_in_time,
      check_out_time,
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get Attendance
const getAttendance = async (req, res) => {
  try {
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    const selfOnly = req.query.self === "true";

    const result = await attendanceService.getAttendance(
      req.user,
      month,
      year,
      selfOnly
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { markAttendance, getAttendance };