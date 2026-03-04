const holidayService = require("../services/holiday.service");

//Add Holiday
exports.addHoliday = async (req, res) => {
  try {
    const { date, name, type } = req.body;

    const holiday = await holidayService.addHoliday(req.user.id, { date, name, type });

    res.status(201).json({
      message: "Holiday added successfully",
      holiday
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message 
    });
  }
};

//Get Holidays
exports.getHolidays = async (req, res) => {
  try {
    const { month, year } = req.query;

    const holidays = await holidayService.getHolidays(month, year);

    res.status(200).json({ 
      success: true,
      data: holidays
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message 
    });
  }
};























// // Mark all Saturdays & Sundays in a month as holidays
// exports.markWeekends = async (req, res) => {
//   try {
//     const { month, year } = req.body;

//     const holidays = await holidayService.markWeekends(req.user.id, month, year);

//     res.json({
//       message: "Weekends marked as holidays",
//       holidays
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };