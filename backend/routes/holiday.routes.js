const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const holidayController = require("../controllers/holiday.controller");

//Add Holiday
router.post("/add", auth, role("HR"), holidayController.addHoliday);

//Get Holidays
router.get("/", auth, holidayController.getHolidays);

module.exports = router;




























// // Auto mark weekends as holidays
// router.post("/mark-weekends", auth, role("HR"), holidayController.markWeekends);
