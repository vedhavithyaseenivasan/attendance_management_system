import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Typography, Select, MenuItem, CircularProgress, FormControl } from "@mui/material";

const MyAttendance = () => {
  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
     
        const response = await axios.get(`http://localhost:5000/api/attendance?month=${month}&year=${year}&self=true`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const dataArray = Array.isArray(response.data?.data) ? response.data.data : [];
        setRecords(dataArray);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [month, year]);

  //Generate years from 2026 back to 2018
  const years = [];
  for (let y = 2026; y >= 2018; y--) years.push(y);

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, width: "100%", maxWidth: 950, borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          My Attendance
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
            <Select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
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
        ) : records.length === 0 ? (
          <Typography align="center" sx={{ mt: 2, color: "#555" }}>
            No attendance records found for this month.
          </Typography>
        ) : (
          <div style={{ overflowX: "auto", borderRadius: "10px", boxShadow: "0px 4px 15px rgba(0,0,0,0.1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#007BFF", color: "#fff" }}>
                <tr>
                  <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Check In</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Check Out</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #eee", transition: "background 0.3s", cursor: "default" }}>
                    <td style={{ padding: "10px" }}>{r.date}</td>
                    <td style={{ padding: "10px" }}>{r.check_in_time || "-"}</td>
                    <td style={{ padding: "10px" }}>{r.check_out_time || "-"}</td>
                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          backgroundColor:
                            r.status === "PRESENT"
                              ? "#D4EDDA"
                              : r.status === "ABSENT"
                              ? "#F8D7DA"
                              : r.status === "LATE"
                              ? "#FFF3CD"
                              : r.status === "HALF_DAY"
                              ? "#CCE5FF"
                              : "#E2E3E5",
                          color:
                            r.status === "PRESENT"
                              ? "#155724"
                              : r.status === "ABSENT"
                              ? "#721C24"
                              : r.status === "LATE"
                              ? "#856404"
                              : r.status === "HALF_DAY"
                              ? "#004085"
                              : "#383D41",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          fontWeight: 600,
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Paper>
    </Box>
  );
};

export default MyAttendance;