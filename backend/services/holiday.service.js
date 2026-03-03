const Holiday = require("../models/holiday.model");
const { Op } = require("sequelize");

//Add holiday
exports.addHoliday = async (userId, { date, name, type }) => {
  return await Holiday.create({
    date,
    name,
    type,
    created_by: userId
  });
  
};

//Get holidays
exports.getHolidays = async (month, year) => {
  let where = {};

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    where.date = { [Op.between]: [startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]] };
  }

  return await Holiday.findAll({
    where,
    order: [["date", "ASC"]]
  });
};























// // Automatically mark all Saturdays & Sundays as holidays
// exports.markWeekends = async (userId, month, year) => {
//   const days = getDaysInMonth(month, year);

//   const weekendHolidays = [];

//   for (const day of days) {
//     if (isWeekend(day)) {
//       weekendHolidays.push({
//         date: day,
//         name: "Weekend",
//         type: "WEEKEND",
//         created_by: userId
//       });
//     }
//   }

//   // Bulk create weekends, ignore duplicates
//   await Holiday.bulkCreate(weekendHolidays, { ignoreDuplicates: true });

//   return weekendHolidays;
// };