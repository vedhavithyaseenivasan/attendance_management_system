import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";

//Helper: returns an array of YYYY-MM-DD strings for the given month
const getDaysArray = (year, month) => {
  const days = [];
  const totalDays = new Date(year, month, 0).getDate(); 
  for (let d = 1; d <= totalDays; d++) {
    const dayStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(
      2,
      "0"
    )}`;
    days.push(dayStr);
  }
  return days;
};

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  //Fetch holidays from backend
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/holiday?month=${month}&year=${year}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dataArray = Array.isArray(response.data?.data) ? response.data.data : [];
        setHolidays(dataArray);
      } catch (err) {
        console.error("Error fetching holidays:", err);
        setHolidays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [month, year]);

  const daysInMonth = getDaysArray(year, month);

  //Map holidays by date string for quick lookup
  const holidayMap = {};
  holidays.forEach((h) => {
    holidayMap[h.date] = h;
  });

  const years = [];
  for (let y = 2026; y >= 2018; y--) years.push(y);

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 950,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2", mb: 3 }}
        >
          Holidays Calendar
        </Typography>

        <Box display="flex" justifyContent="center" gap={2} mb={3}>
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 100 }}>
            <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box textAlign="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : daysInMonth.length === 0 ? (
          <Typography align="center" sx={{ mt: 2, color: "#555" }}>
            No days found.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <Box key={d} sx={{ fontWeight: "bold", textAlign: "center" }}>
                {d}
              </Box>
            ))}

            {Array(new Date(year, month - 1, 1).getDay())
              .fill(null)
              .map((_, i) => (
                <Box key={`empty-${i}`} />
              ))}

            {daysInMonth.map((dayStr) => {
              const holiday = holidayMap[dayStr];

              return (
                <Box
                  key={dayStr}
                  sx={{
                    backgroundColor: holiday ? "#007BFF" : "#fff",
                    color: holiday ? "#fff" : "#000",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "8px",
                    border: holiday ? "none" : "1px solid #ddd",
                    cursor: holiday ? "pointer" : "default",
                  }}
                  title={holiday ? holiday.name : ""}
                >
                  {Number(dayStr.split("-")[2])}
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Holidays;

