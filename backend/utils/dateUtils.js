// Returns array of YYYY-MM-DD dates for a given month
exports.getDaysInMonth = (month, year) => {
  const date = new Date(year, month - 1, 1);
  const days = [];

  while (date.getMonth() === month - 1) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    days.push(`${yyyy}-${mm}-${dd}`);
    date.setDate(date.getDate() + 1);
  }

  return days;
};

// Returns true if date is Saturday or Sunday
exports.isWeekend = (dateString) => {
  const day = new Date(dateString).getDay();
  return day === 0 || day === 6;
};